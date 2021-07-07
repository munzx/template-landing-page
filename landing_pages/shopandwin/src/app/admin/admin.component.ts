import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { faArrowLeft, faArrowRight, faSignOutAlt, faWindowClose  } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { fromEvent, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  @ViewChild('searchbox', { static: true }) searchbox: ElementRef<HTMLInputElement>;
  
  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;
  faSignOutAlt = faSignOutAlt;
  faWindowClose = faWindowClose;
  searchword = '';

  page = 1;
  numberOfPages = 0;
  pageMoveBy = 20;
  skip = 0;

  count: any = 0;
  users: any = [];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.getUsers(0);

    this.http.get('/api/users/count').subscribe(count=>{
      this.count = count;
      this.numberOfPages = Math.ceil(this.count / this.pageMoveBy);
    }, err=>{
      console.log(err);
    });

    /**
     * If you are using Reactive form, then use
     * form.get('<form-control-name>').valueChanges
     */
    const inputChanges$ = fromEvent(this.searchbox.nativeElement, 'keyup');
    inputChanges$
      .pipe(
        // remove the below map operator if you are using Reactive forms formControl
        map(event => (event.target as HTMLInputElement).value),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(val => {
          // perform the http call for your service API like below
          return this.http.get(`/api/search/${val}`)
          // return of(`sevice api all for: ${val}`);
        })
      )
      .subscribe(data=>{
        console.log(data);
        if(data == null){
          this.getUsers(this.skip);
        } else {
          this.users = data;
        }
      });
  }

  clearSearchBox(){
    this.searchbox.nativeElement.value = '';
    this.getUsers(this.skip);
  }
  
  logout(){
    this.http.get('/api/admin/logout').subscribe(data=>{
      this.router.navigate(['login']);
    }, err=>{
      console.log(err);
    });
  }

  getUsers(from){
    this.http.get(`/api/users/${from}`).subscribe(result=>{
      this.users = result;
    }, err=>{
      console.log(err);
    });
  }

  nextPage(){
    if(this.page + 1 <= this.numberOfPages){
      this.page++;
      this.skip += this.pageMoveBy;
      this.getUsers(this.skip);
    }
  }

  previousPage(){
    if((this.page > 1) && (this.page - 1 <= this.numberOfPages)){
      this.page--;
      this.skip -= this.pageMoveBy;
      this.getUsers(this.skip);
    }
  }

}
