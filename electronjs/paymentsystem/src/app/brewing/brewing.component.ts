import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brewing',
  templateUrl: './brewing.component.html',
  styleUrls: ['./brewing.component.scss'],
})
export class BrewingComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['standby']);
    }, 5000);
  }

}
