import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  SimpleChange,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { MatSort } from '@angular/material';
import { contactsTableColumns } from './contacts-table.columns';
import { ContactsDataSource } from '../contacts-data-source';

@Component({
  selector: 'app-contacts-table',
  styleUrls: ['contacts-table.component.scss'],
  templateUrl: 'contacts-table.component.html',
})
export class ContactsTableComponent implements AfterViewInit, OnChanges, OnDestroy {
  displayedColumns = contactsTableColumns;
  isLoadingResults = false;
  
  @Input() dataSource: ContactsDataSource;
  @Input() favoritesFirst;
  @Output() call = new EventEmitter();
  @Output() editContact = new EventEmitter();

  @ViewChild(MatSort) sort: MatSort;

  constructor() {}

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.dataSource.sort(this.sort, this.favoritesFirst));
  }

  ngOnChanges(changes: SimpleChanges) {
    const favoritesFirst: SimpleChange = changes.favoritesFirst;
    this.dataSource.sort(
      this.sort,
      favoritesFirst ? favoritesFirst.currentValue : this.favoritesFirst,
    );
  }

  edit(id, contact) {
    this.editContact.emit(contact);
  }

  delete(id) {
    this.dataSource.delete(id).subscribe();
  }

  dial(phoneNumber) {
    this.call.emit(phoneNumber);
  }

  ngOnDestroy() {
    this.sort.sortChange.unsubscribe();
  }
}
