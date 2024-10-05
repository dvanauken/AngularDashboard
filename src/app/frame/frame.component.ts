import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';

@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.scss']
})
export class FrameComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer?: ElementRef;
  @ViewChild('tableContainer', { static: false }) tableContainer?: ElementRef;
  @ViewChild('slider', { static: false }) slider?: ElementRef;

  private isResizing = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // Delay the initialization to ensure all ViewChild references are resolved
    setTimeout(() => this.initializeSlider(), 0);
  }

  initializeSlider(): void {
    if (!this.slider || !this.mapContainer || !this.tableContainer) {
      console.error('One or more required elements are not available');
      return;
    }

    const slider = this.slider.nativeElement;
    const mapContainer = this.mapContainer.nativeElement;
    const tableContainer = this.tableContainer.nativeElement;

    slider.addEventListener('mousedown', this.onMouseDown.bind(this));
  }

  onMouseDown(e: MouseEvent): void {
    e.preventDefault();
    this.isResizing = true;
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (!this.isResizing || !this.slider || !this.mapContainer || !this.tableContainer) return;

    const container = this.slider.nativeElement.parentElement;
    const containerRect = container.getBoundingClientRect();
    const newPosition = e.clientX - containerRect.left;
    const percentage = (newPosition / containerRect.width) * 100;

    if (percentage > 10 && percentage < 90) {
      this.mapContainer.nativeElement.style.width = `${percentage}%`;
      this.tableContainer.nativeElement.style.width = `${100 - percentage}%`;
      this.slider.nativeElement.style.left = `${percentage}%`;
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.isResizing = false;
  }
}
