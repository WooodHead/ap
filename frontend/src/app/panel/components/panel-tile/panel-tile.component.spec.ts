import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelTileComponent } from '@app/panel/components/panel-tile/panel-tile.component';

describe('PanelTileComponent', () => {
  let component: PanelTileComponent;
  let fixture: ComponentFixture<PanelTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PanelTileComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelTileComponent);
    component = fixture.componentInstance;
    component.title = 'Test title';
    component.data = 12345;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check input', () => {
    expect(component.title).toBe('Test title');
    expect(component.data).toBe(12345);
  });
});
