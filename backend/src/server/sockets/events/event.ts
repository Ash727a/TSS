class Event {
  event;
  payload;

  constructor(data: { event: any; payload: any }) {
    if (data.event) {
      this.event = data.event;
      this.payload = data.payload;
    }
  }

  stringifyMessage(): string {
    const msg = {
      event: this.event,
      payload: this.payload,
    };

    // console.log(msg);
    return JSON.stringify(msg);
  }
}

export default Event;
