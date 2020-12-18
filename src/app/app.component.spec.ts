
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { } from 'jasmine';

import { AppComponent } from './app.component';


describe('AppComponent (template)', () => {

  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent], // declare the test component
      imports: [RouterTestingModule]
    }).compileComponents();
  }));
  // 2nd beforeEach synchronous
  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    comp = fixture.componentInstance; // AppComponent test instance
  });

  it('should create component', () => expect(comp).toBeDefined());

});
