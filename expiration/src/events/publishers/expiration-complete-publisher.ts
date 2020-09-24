import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@eatickets/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
