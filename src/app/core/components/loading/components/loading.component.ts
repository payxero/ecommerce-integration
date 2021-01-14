import { Component, ElementRef, Input } from '@angular/core';

@Component({
    selector: 'app-loading',
    templateUrl: 'loading.component.html',
    styleUrls: ['loading.component.scss'],
})

export class LoadingComponent {
    _elementRef: ElementRef<HTMLElement>;
    @Input() dotColor: string;
    @Input() dotSize: number;

    constructor(private _ref: ElementRef<HTMLElement>) {
        this._ref.nativeElement.classList.add('loading');
        this._elementRef = this._ref;
    }

    setStyles(dotColor?: string, dotSize?: number) {
        return {
            'background-color': dotColor ? dotColor : '#1E88E5',
            'width': dotSize ? `${dotSize}px` : '8px',
            'height': dotSize ? `${dotSize}px` : '8px',
        };
    }
}
