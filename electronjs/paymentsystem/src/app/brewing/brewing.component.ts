import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brewing',
  templateUrl: './brewing.component.html',
  styleUrls: ['./brewing.component.scss'],
})
export class BrewingComponent implements OnInit {
  constructor(private router: Router) { }

  redirectTimer() {
    setTimeout(() => {
      this.router.navigate(['standby']);
    }, 11000);
  }

  ngOnInit() {
    this.redirectTimer();
  }
}
