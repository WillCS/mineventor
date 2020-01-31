import React from 'react';
import { Component, ReactNode } from 'react';
import './App.css';
import { Viewport } from './layout/Viewport';
import { DetailView } from './layout/DetailView';
import { ControlBar } from './layout/ControlBar';
import { RenderManager } from './graphics/renderManager';
import { ControlButton, ControlButtonDescriptor } from './layout/control/ControlButton';
import { EditorContext } from './state/editorContext';
import { ContextStore } from './state/contextStore';
import { observer } from 'mobx-react';

export interface AppState {
  contextStore: ContextStore;
}

@observer
export default class App extends Component<any, AppState, any> {
  private renderManager: RenderManager;

  public constructor(props: any) {
    super(props);

    this.renderManager = new RenderManager();

    this.state = {
      contextStore: new ContextStore(),
    };
  }

  public componentDidMount(): void {
    // this.stateMutator.registerContextChangeListener(this.renderManager.contextChanged);
    // this.stateMutator.registerContextChangeListener(this.createNewModel)
  }

  public componentWillUnmount(): void {
    // this.stateMutator.deregisterContextChangeListener(this.renderManager.contextChanged);
    // this.stateMutator.deregisterContextChangeListener(this.createNewModel)
  }

  public render(): ReactNode {
    return (
      <div className='appContainer'>
        <ControlBar>
          { this.state.contextStore.context.populateControlBar().map(
            (buttonProps: ControlButtonDescriptor) => (
              <ControlButton
                key     = {buttonProps.key}
                title   = {buttonProps.title}
                type    = {buttonProps.type}
                onClick = {buttonProps.onClick}
              />)) }
        </ControlBar>

        <DetailView 
          show    = {this.state.contextStore.context instanceof EditorContext}
          context = {this.state.contextStore.context}
        />

        <Viewport 
          context       = {this.state.contextStore.context}
          renderManager = {this.renderManager}
        />
      </div>
    );
  }
}
