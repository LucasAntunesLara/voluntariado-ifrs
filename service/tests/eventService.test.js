const assert = require("node:assert/strict");
const { test } = require("node:test");
const EventModel = require("../src/models/eventModel");
const EventVolunteerModel = require("../src/models/eventVolunteerModel");
const EventService = require("../src/services/eventService");

const validEvent = {
  title: "Mutirão comunitário",
  description: "Ação de voluntariado.",
  location: "IFRS",
  date: "2026-11-30T09:00:00",
  max_volunteers: 20,
};

test("rejects incomplete event data", async () => {
  await assert.rejects(EventService.create({ ...validEvent, title: " " }), {
    message: "O campo title é obrigatório.",
    status: 400,
  });
});

test("rejects a non-positive volunteer limit", async () => {
  await assert.rejects(
    EventService.create({ ...validEvent, max_volunteers: 0 }),
    {
      message: "O limite de voluntários deve ser um inteiro positivo.",
      status: 400,
    },
  );
});

test("persists trimmed event fields and a numeric capacity", async () => {
  const originalCreate = EventModel.create;
  EventModel.create = async (event) => {
    assert.equal(event.title, validEvent.title);
    assert.equal(event.max_volunteers, validEvent.max_volunteers);
    return 42;
  };

  try {
    assert.equal(
      await EventService.create({
        ...validEvent,
        title: ` ${validEvent.title} `,
        max_volunteers: "20",
      }),
      42,
    );
  } finally {
    EventModel.create = originalCreate;
  }
});

test("does not reduce event capacity below confirmed registrations", async () => {
  const originalFindById = EventModel.findById;
  const originalCountByEvent = EventVolunteerModel.countByEvent;
  const originalUpdate = EventModel.update;
  EventModel.findById = async () => ({ id: 1 });
  EventVolunteerModel.countByEvent = async () => 2;
  EventModel.update = async () => {
    throw new Error("The event must not be updated.");
  };

  try {
    await assert.rejects(
      EventService.update(1, { ...validEvent, max_volunteers: 1 }),
      {
        message:
          "O limite não pode ser menor que o número de voluntários confirmados.",
        status: 409,
      },
    );
  } finally {
    EventModel.findById = originalFindById;
    EventVolunteerModel.countByEvent = originalCountByEvent;
    EventModel.update = originalUpdate;
  }
});
