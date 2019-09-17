import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule } from '@app/shared/material';
import { ComponentsModule } from '@app/shared/components';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '@app/auth/services/auth.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from '@app/auth/services/auth.guard';
import { VSTranslateModule } from '@app/shared/translate/vs-translate.module';
import { HeaderComponent } from '@app/panel/components/header/header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        VSTranslateModule,
        MaterialModule,
        ComponentsModule,
      ],
      providers: [
        AuthService,
        AuthGuard,
      ],
      declarations: [HeaderComponent],
    });

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    component.agent = {
      agent: 1,
      extension: 2,
      username: 'test',
    };

    component.breaks = [{
      pauseCode: 1,
      pauseReason: 'test',
    }];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display agent data', () => {
  });

  it('should emit an event on logout button click', async(() => {
    spyOn(component.logout, 'emit');

    fixture.nativeElement
      .querySelector('.logout')
      .click();

    expect(component.logout.emit).toHaveBeenCalled();
  }));
});
