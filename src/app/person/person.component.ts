import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {ModalDismissReasons,NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../api.service';
import { Person } from '../person';
import { Subscription, interval } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  deletedId: number=0;
  closedResult: string ="";
  editPerson!: FormGroup;
  private updateSubscription: Subscription = new Subscription;

    ngOnInit(): void {
      this.personApiService.refreshneeds.subscribe(()=>{
        this.getPersonsInformation();
      })
this.getPersonsInformation();
this.editPerson=this.fb.group(
  {
    personId:[null,[Validators.required]],
    firstName:[null,[Validators.required]],
    lastName:[null,[Validators.required]],
    age:[null,[Validators.required]]

  }
)
    }
    person: Person[] = [];
    

    public displayedColumns = ['id','firstName','lastName','age','actions' ];
    //the source where we will get the data
    public dataSource = new MatTableDataSource<Person>();
  
    //dependency injection
    constructor(private personApiService: ApiService,
      private modalService:NgbModal,
      private fb:FormBuilder) {
    }

    newPerson:FormGroup = this.fb.group({
      firstName:[null,[Validators.required]],
      lastName:[null,[Validators.required]],
      age:[null,[Validators.required]]
    });

    getPersonsInformation(){
      this.personApiService.getPersons()
        .subscribe((res)=>{
          console.log(res);
          this.dataSource.data = res;
        })
      }

      open(content: any){
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result)=>{
          this.closedResult = `Closed with : ${result}`;
        },(reason)=>{
          this.closedResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }

      private getDismissReason(reason:any): string {
        if(reason === ModalDismissReasons.ESC){
          return 'by presing ESC';
        } else if(reason === ModalDismissReasons.BACKDROP_CLICK){
          return 'by clicking on a backdrop';
        }
        else{
          return `with: ${reason}`;
        }
      }
      deletePerson(targetModal: any, person: Person){
        this.deletedId = person.personId;
        this.modalService.open(targetModal, {
          backdrop:'static',
          size:'md'
        });

      }
      onDelete(person:Person) {
        return this.personApiService.deletePerson(person.personId).subscribe(
          {
            next:(result:any)=> {
              this.modalService.dismissAll();
              alert("Person deleted");
            },
            error:(err:any)=>{
              this.modalService.dismissAll();
            },
            complete:()=>{
              console.log('complete');
            }
          }
        )
      }

      onSubmitPerson(){
        var a = this.newPerson.value;
        this.personApiService.addPerson(a).subscribe(
          {
            next: (result: any)=>{
              console.log(result);
              this.modalService.dismissAll();
              alert("person added successfully")
            },
            error: (err:any)=>{
              console.log(err);
            },
            complete:()=>
            {
              console.log('complete');
              this.newPerson.reset();
            }
          }
        )
      }

      openEdit(targetModal:any,person:Person){
        this.modalService.open(targetModal,{
          centered:true,
          backdrop:'static',
          size:'md'
        });
        let editPersonDetails ={
          personId:person.personId,
          firstName:person.firstName,
          lastName:person.lastName,
          age:person.age
        }
        this.editPerson.patchValue(editPersonDetails)
      }

      onSave(){
        return this.personApiService.editPerson(this.editPerson.value.personId,this.editPerson.value).subscribe(
          {
            next: (result:any)=>{

            },
            error:(err:any)=>{
              console.log(err)
            },
            complete:()=>{

            }
          }
        )
      }
  
}
