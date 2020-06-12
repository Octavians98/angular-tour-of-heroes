import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { catchError, map, tap } from 'rxjs/operators';
import { Hero }         from '../hero';
import { HeroService }  from '../hero.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hero-details',
  templateUrl: './hero-details.component.html',
  styleUrls: [ './hero-details.component.css' ]
})
export class HeroDetailsComponent implements OnInit {
  private heroesUrl = 'api/heroes';
  hero: Hero;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }
  
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.heroService.log(`updated hero id=${hero.id}`)),
      catchError(this.heroService.handleError<any>('updateHero'))
    );
  }

  save(): void {
    this.updateHero(this.hero)
      .subscribe(() => this.goBack());
  }
}