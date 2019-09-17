import { State, Selector, Action, StateContext } from '@ngxs/store';
import { SetSmallScreen } from '@app/core/store/layout.actions';

export class LayoutStateModel {
  isSmallScreen: boolean;
}

@State<LayoutStateModel>({
  name: 'layout',
  defaults: {
    isSmallScreen: false,
  },
})

export class LayoutState {
  @Selector()
  static getIsSmallScreen(state: LayoutStateModel) { return state.isSmallScreen; }

  @Action(SetSmallScreen)
  onSetSmallScreen({ patchState }: StateContext<LayoutStateModel>) {
    patchState({ isSmallScreen: true });
  }
}
