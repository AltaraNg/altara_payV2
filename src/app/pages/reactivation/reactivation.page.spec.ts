import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReactivationPage } from './reactivation.page';

describe('ReactivationPage', () => {
  let component: ReactivationPage;
  let fixture: ComponentFixture<ReactivationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReactivationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReactivationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
