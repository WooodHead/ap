import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactsController } from './contacts.controller';
import { contactsSchema } from '../schemas/contacts.schema';
import { ContactsService } from './services/contacts.service';
import { sessionSchema } from '../schemas/session.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: 'Contacts', schema: contactsSchema },
      { name: 'Session', schema: sessionSchema },
    ]),
  ],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [MongooseModule],
})
export class ContactsModule {}
