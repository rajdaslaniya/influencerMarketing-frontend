import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { startWith, map } from 'rxjs/operators';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { NumberFormatPipe } from './pipes/number-format.pipe';
import { NgxSpinnerService,NgxSpinnerModule } from "ngx-spinner";  

interface IOptionSearchAPI {
  success: boolean;
  data: IOptionData[];
}

interface IOptionData {
  user_id: Number;
  username: string;
  fullname: string;
  picture: string;
  followers: Number;
  is_verified: boolean;
}

interface IPostItem {
  display_url: string;
  like_count: number;
  comment_count: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    NgFor,
    AsyncPipe,
    MatGridListModule,
    MatCardModule,
    NgxSpinnerModule
  ],
})
export class AppComponent {
  myControl = new FormControl('');
  options: IOptionData[] = [];
  posts: IPostItem[] = [];

  constructor(
    private http: HttpClient,
    private numberFormat: NumberFormatPipe,
    private SpinnerService: NgxSpinnerService
  ) {}

  transformValue(value: any): any {
    return this.numberFormat.transform(value);
  }

  searchOptions() {
    const searchTerm = this.myControl.value;
    this.http
      .get<any[]>(`http://localhost:3000/user?search=${searchTerm}`)
      .subscribe((response: any) => {
        this.options = response.data;
      });
  }

  onOptionSelected(event: any) {
    this.SpinnerService.show();  
    const selectedOption = event.option.value;
    this.http
      .get<any[]>(
        `http://localhost:3000/user/post?search=${selectedOption.username}`
      )
      .subscribe((response: any) => {
        this.posts = response;
        this.SpinnerService.hide();  
        // this.options = response.data;
      });
    // Perform additional actions based on the selected option
  }

  public displayProperty(value: any) {
    if (value) {
      return value.fullname;
    }
  }
}
