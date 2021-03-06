import { Scene } from '../scene';
import { Camera, OrbitalCamera, ProjectionType } from '../camera';
import { Vec3 } from '../../math/vector';
import { ShaderProgram } from '../shaderProgram';
import { WebGLHelper } from '../webGLHelper';
import { getAxes, modelFragSource, modelVertSource } from './commonSceneResources';
import { StaticMesh } from '../staticMesh';
import { Mat4 } from '../../math/matrix';
import { DynamicMesh } from '../dynamicMesh';
import { Box, Assembly, EntityModel } from '../../model/entityModel';
import { buildBoxMesh, updateBoxMesh } from './entitySceneResources';
import { deepObserve } from 'mobx-utils';
import { EntityContext } from '../../state/appContexts/entityContext';
import { AppContext } from '../../state/context';
import { MathHelper } from '../../math/mathHelper';

export class EntityScene extends Scene {
  private camera:          Camera;
  private shaderProgram?:  ShaderProgram;
  private axes?:           StaticMesh;

  private modelChanged:    boolean;
  private geometryMap:     Map<Box, DynamicMesh>;
  private persistanceMap:  Map<Box, boolean>;
  private disposeListener: () => void;

  public constructor() {
    super();

    this.disposeListener = () => {};
    this.modelChanged    = false;
    this.geometryMap     = new Map<Box, DynamicMesh>();
    this.persistanceMap  = new Map<Box, boolean>();

    this.camera = new OrbitalCamera(Vec3.zero(), Math.PI / 4, Math.PI / 4, 100);
    this.camera.viewportWidth    = this.viewportWidth;
    this.camera.viewportHeight   = this.viewportHeight;
    this.camera.projectionType   = ProjectionType.PERSPECTIVE;
    this.camera.farPlaneDistance = 200;
    (this.camera as OrbitalCamera).azimuth = (Math.PI / 4)
  }

  public getCamera(): Camera {
    return this.camera;
  }

  public setContext(context: AppContext): void {
    super.setContext(context);

    this.disposeListener = deepObserve(this.getContext().model, change => this.modelChanged = true);
    this.modelChanged    = true;
  }

  public init(webGL: WebGLRenderingContext): void {
    this.shaderProgram = new ShaderProgram(
      WebGLHelper.buildShaderProgram(webGL, modelVertSource.default, modelFragSource.default));

    this.shaderProgram.setCamera(this.camera);

    this.axes = getAxes(webGL);
  }

  public preRender(webGL: WebGLRenderingContext, time: number): void {
    this.getShaderProgram().enable(webGL);
    
    if(this.modelChanged) {
      this.updateGeometry(webGL);
      this.modelChanged = false;
    }

    webGL.clearColor(132 / 255, 191 / 255, 225 / 255, 1.0);
    webGL.lineWidth(2);

    webGL.enable(webGL.CULL_FACE);
    webGL.cullFace(webGL.BACK);
    webGL.frontFace(webGL.CCW);

    webGL.enable(webGL.DEPTH_TEST);

    this.getShaderProgram().setUniforms(webGL);
  }

  public render(webGL: WebGLRenderingContext, time: number): void {
    super.render(webGL, time);
    this.axes?.draw(webGL, this.getShaderProgram(), Mat4.identity());

    (this.getContext().model as EntityModel).assemblies.assemblies.forEach(
      subAssembly => this.renderAssembly(webGL, subAssembly, time, Mat4.identity()));
  }

  private renderAssembly(
    webGL: WebGLRenderingContext,
    assembly: Assembly,
    time: number,
    modelTransformMatrix: Mat4
  ): void {
    const translation: Vec3 = assembly.offset;
    const rotateOffset: Vec3 = assembly.rotationPoint;

    const x    = translation.x  || 0;
    const y    = translation.y  || 0;
    const z    = translation.z  || 0;
    const xRot = rotateOffset.x || 0;
    const yRot = rotateOffset.y || 0;
    const zRot = rotateOffset.z || 0;

    let modelMat: Mat4 = modelTransformMatrix
      .translate(x, y, z)
      .translate(xRot, yRot, zRot)
      .rotateX(MathHelper.radToDeg(assembly.rotationAngle.x) || 0)
      .rotateY(MathHelper.radToDeg(assembly.rotationAngle.y) || 0)
      .rotateZ(MathHelper.radToDeg(assembly.rotationAngle.z) || 0)
      .translate(-xRot, -yRot, -zRot);

    assembly.cubes.boxes.forEach(
      box => this.renderBox(webGL, box, time, modelMat));

    assembly.children.assemblies.forEach(
      subAssembly => this.renderAssembly(webGL, subAssembly, time, modelMat));
  }

  private renderBox(
    webGL: WebGLRenderingContext,
    box: Box,
    time: number,
    modelTransformMatrix: Mat4
  ): void {
    const mesh = this.geometryMap.get(box);
    const pos  = box.position;
    const x = pos.x || 0;
    const y = pos.y || 0;
    const z = pos.z || 0;
    
    let modelMat: Mat4 = modelTransformMatrix.translate(x, y, z);

    if(mesh) {
      mesh.draw(webGL, this.getShaderProgram(), modelMat);
    }
  }

  public dispose(webGL: WebGLRenderingContext): void {
    this.getShaderProgram().dispose(webGL);
    this.axes!.dispose(webGL);
    this.disposeListener();
    Array.from(this.geometryMap.values()).forEach(mesh => mesh.dispose(webGL));
  }

  public setViewportSize(width: number, height: number): void {
    super.setViewportSize(width, height);
    this.camera.viewportWidth  = width;
    this.camera.viewportHeight = height;
  }

  private updateGeometry(webGL: WebGLRenderingContext): void {
    this.persistanceMap.forEach((v, k) => this.persistanceMap.set(k, false));

    (this.getContext().model as EntityModel).assemblies.assemblies.forEach(
      subassembly => this.updateGeometryForAssembly(webGL, subassembly));

    this.persistanceMap.forEach((v, k) => {
      if(!v) {
        this.geometryMap.get(k)?.dispose(webGL);
        this.persistanceMap.delete(k);
      }
    });
  }

  private updateGeometryForAssembly(webGL: WebGLRenderingContext, assembly: Assembly): void {
    assembly.cubes.boxes.forEach(        box         => this.updateGeometryForBox(webGL, box));
    assembly.children.assemblies.forEach(subassembly => this.updateGeometryForAssembly(webGL, subassembly));
  }

  private updateGeometryForBox(webGL: WebGLRenderingContext, box: Box): void {
    let mesh: DynamicMesh;
    if(this.geometryMap.has(box)) {
      mesh = this.geometryMap.get(box)!;
      mesh = updateBoxMesh(webGL, box, mesh);
    } else {
      mesh = buildBoxMesh(webGL, box);
    }

    this.geometryMap.set(box, mesh);
    this.persistanceMap.set(box, true);
  }

  private getShaderProgram(): ShaderProgram {
    if(this.shaderProgram) {
      return this.shaderProgram;
    } else {
      throw new Error('Scene ShaderProgram accessed before being initialised.');
    }
  }

  private getContext(): EntityContext {
    if(this.context) {
      return (this.context as EntityContext);
    } else {
      throw new Error('Scene Context accessed before being set.');
    }
  }
}
