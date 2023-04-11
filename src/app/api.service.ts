import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject, catchError, map} from "rxjs";
import { Person } from './person';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  PersonSubject = new Subject<void>();
  deletePerson(deletedId: number) {
    return this.http.delete('http://localhost:8089/springbootapp/delete/'+deletedId)
    .pipe(
      map((resData:any)=>{
        this.modalService.dismissAll();
        this.PersonSubject.next();
        return resData;

      }),
      catchError((err:any)=>{
        this.modalService.dismissAll();
        throw err;
      })
    )
  }
get refreshneeds() {
  return this.PersonSubject;
}
  constructor(private http:HttpClient, private modalService:NgbModal) { }

  getPersons(){
    return this.http.get<Person[]>('http://localhost:8089/springbootapp/getallpersons')
    .pipe(
      map((result:any)=>{
        return result;
      }
    ),
    catchError((err:any)=>{
      throw err;
    })
    );
  }

  addPerson(value: NgForm){

    return this.http
    .post<Person[]>('http://localhost:8089/springbootapp/insertperson',value)
    .pipe(
      map((resData:any)=>{
        this.PersonSubject.next();
        return resData;
      }),
      catchError((err:any)=> {

        throw err;
      })
    );

  }

  editPerson(id:any,value:any){
    return this.http.put<Person>('http://localhost:8089/springbootapp/updateperson/'+id,value)
    .pipe(
      map((resData:any)=>{
        this.modalService.dismissAll();
        this.PersonSubject.next();
        alert("person edited suceessfully");
        return resData;
      }),
      catchError((err:any)=>{
        this.modalService.dismissAll();
        throw err;
      })
    );
  }
}
