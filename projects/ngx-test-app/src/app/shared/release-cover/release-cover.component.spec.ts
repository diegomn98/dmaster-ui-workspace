import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseCoverComponent } from './release-cover.component';

@Component({
  selector: 'app-test-motif',
  template: '<span class="test-motif">motif</span>',
})
class TestMotifComponent {}

@Component({
  imports: [ReleaseCoverComponent],
  template: `
    <app-release-cover version="v0.12" date="2026-11-16" [hue]="328" label="Projected cover">
      <span class="projected">projected</span>
    </app-release-cover>
  `,
})
class ProjectionHostComponent {}

describe('ReleaseCoverComponent', () => {
  let fixture: ComponentFixture<ReleaseCoverComponent>;
  let host: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    fixture = TestBed.createComponent(ReleaseCoverComponent);
    fixture.componentRef.setInput('version', 'v0.12');
    fixture.componentRef.setInput('date', '2026-11-16');
    fixture.componentRef.setInput('hue', 328);
    fixture.componentRef.setInput('label', 'Illustration: the package exploded into tiles.');
    fixture.detectChanges();
    host = fixture.nativeElement as HTMLElement;
  });

  it('is a single accessible image with the given description', () => {
    expect(host.getAttribute('role')).toBe('img');
    expect(host.getAttribute('aria-label')).toBe('Illustration: the package exploded into tiles.');
  });

  it('always renders with the dark tokens and the release hue', () => {
    expect(host.getAttribute('data-dm-theme')).toBe('dark');
    expect(host.style.getPropertyValue('--dm-cover-hue')).toBe('328');
  });

  it('signs the corners with the brand, the version and the date', () => {
    expect(host.querySelector('.rc__brand')?.textContent).toBe('@dmaster/ui');
    expect(host.querySelector('.rc__version')?.textContent).toBe('v0.12');
    expect(host.querySelector('.rc__date')?.textContent).toBe('2026-11-16');
  });

  it('renders the motif component inside an inert layer', () => {
    fixture.componentRef.setInput('motif', TestMotifComponent);
    fixture.detectChanges();
    const motif = host.querySelector('.rc__motif');
    expect(motif?.hasAttribute('inert')).toBe(true);
    expect(motif?.querySelector('.test-motif')?.textContent).toBe('motif');
  });

  it('accepts a projected motif instead of a component', () => {
    const projection = TestBed.createComponent(ProjectionHostComponent);
    projection.detectChanges();
    const el = projection.nativeElement as HTMLElement;
    expect(el.querySelector('.rc__motif .projected')?.textContent).toBe('projected');
    expect(el.querySelector('app-release-cover')?.getAttribute('aria-label')).toBe(
      'Projected cover',
    );
  });
});
