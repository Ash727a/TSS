import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-shared-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() public variant: string | undefined;
  @Input() public title: string | undefined;
  @Input() public subtitle: string | undefined;
  @Input() public size: string | undefined;

  constructor() {}

  ngOnInit() {}
}
