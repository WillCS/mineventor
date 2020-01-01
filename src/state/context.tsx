import React from 'react';
import { ReactNode } from 'react';
import { ContextController } from './contextController';
import { ControlButton, ControlButtonType } from '../control/ControlButton';

export abstract class AppContext {
  public shouldDisplayDetailView(): boolean {
    return true;
  }

  public abstract populateControlBar(contextController: ContextController): ReactNode[];
}

export class DefaultContext extends AppContext {
  public static readonly DEFAULT_CONTEXT = new DefaultContext();

  private constructor() {
    super();
  }

  public shouldDisplayDetailView(): boolean {
    return false;
  }

  public populateControlBar(contextController: ContextController): ReactNode[] {
    return [
      <ControlButton key={'entity'}
        type={ControlButtonType.ENTITY_MODEL}
        title='Create new Entity Model'
        onClick={this.createEntityModel(contextController)}
      />,
      <ControlButton key={'json'}
        type={ControlButtonType.JSON_MODEL}
        title='Create new JSON Model'
      />
    ];
  }

  private createEntityModel(contextController: ContextController): 
      (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void {
    return (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      contextController.setContext(new EntityContext())
    };
  }
}

export class EntityContext extends AppContext {
  constructor() {
    super();
  }

  public populateControlBar(contextController: ContextController): ReactNode[] {
    return [];
  }
}