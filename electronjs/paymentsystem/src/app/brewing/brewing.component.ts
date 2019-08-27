import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brewing',
  templateUrl: './brewing.component.html',
  styleUrls: ['./brewing.component.scss'],
})
export class BrewingComponent implements OnInit {
  redirectTimer: any;

  constructor(private router: Router) { }

  ngOnInit() {
    this.redirectTimer = setTimeout(() => {
      this.router.navigate(['standby']);
    }, 5000);
    this.redirectTimer();
  }

  ngOnDestroy() {
    this.redirectTimer = undefined;
  }

}
