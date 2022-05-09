import {
  InvalidTestCase,
  ValidTestCase,
} from "@typescript-eslint/utils/dist/ts-eslint";
import {
  limitSlashSlashComments,
  MessageIds,
} from "../../src/rules/limit-slash-slash-comments";
import { ruleTester } from "../utils";

const valid: ValidTestCase<unknown[]>[] = [];
const invalid: InvalidTestCase<MessageIds, unknown[]>[] = [];

valid.push({
  name: "Using a single-line comment with exactly 100 characters",
  code: `
// But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was
  `,
});

invalid.push({
  name: "Using a single-line comment with exactly 101 characters",
  code: `
// But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain felt
  `,
  errors: [{ messageId: "incorrectlyFormatted" }],
  output: `
// But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain
// felt
  `,
});

invalid.push({
  name: "Using a single-line comment with no preceding or trailing whitespace",
  code: `// But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will`,
  errors: [{ messageId: "incorrectlyFormatted" }],
  output: `// But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was
// born and I will`,
});

valid.push({
  name: "Using a multi-line comment with exactly 100 characters",
  code: `
// But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was
// born and I will give you a complete account of the system
    `,
});

invalid.push({
  name: "Using a multi-line comment that is too long",
  code: `
// But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and
// I will give you a complete account of the system
  `,
  errors: [{ messageId: "incorrectlyFormatted" }],
  output: `
// But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was
// born and I will give you a complete account of the system
  `,
});

invalid.push({
  name: "Using a multi-line comment with with many long lines",
  code: `
// But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will
// give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder
// of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how
// to pursue pleasure rationally encounter consequences that are extremely painful.
  `,
  errors: [{ messageId: "incorrectlyFormatted" }],
  output: `
// But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was
// born and I will give you a complete account of the system, and expound the actual teachings of
// the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes,
// or avoids pleasure itself, because it is pleasure, but because those who do not know how to
// pursue pleasure rationally encounter consequences that are extremely painful.
  `,
});

valid.push({
  name: "Using a multi-line comment with with exactly 100 characters inside a function",
  code: `
function foo() {
  // But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain a
}
  `,
});

invalid.push({
  name: "Using a multi-line comment with with exactly 101 characters inside a function",
  code: `
function foo() {
  // But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain as
}
  `,
  errors: [{ messageId: "incorrectlyFormatted" }],
  output: `
function foo() {
  // But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain
  // as
}
  `,
});

invalid.push({
  name: "Using a multi-line comment with that is too long inside a function",
  code: `
function foo() {
  // But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was
  // born and I will give you a complete account of the system
}
  `,
  errors: [{ messageId: "incorrectlyFormatted" }],
  output: `
function foo() {
  // But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain
  // was born and I will give you a complete account of the system
}
  `,
});

invalid.push({
  name: "Using a multi-line comment with many long lines inside a function",
  code: `
function foo() {
  // But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will
  // give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder
  // of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how
  // to pursue pleasure rationally encounter consequences that are extremely painful.
}
  `,
  errors: [{ messageId: "incorrectlyFormatted" }],
  output: `
function foo() {
  // But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain
  // was born and I will give you a complete account of the system, and expound the actual teachings
  // of the great explorer of the truth, the master-builder of human happiness. No one rejects,
  // dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know
  // how to pursue pleasure rationally encounter consequences that are extremely painful.
}
  `,
});

invalid.push({
  name: "Using a multi-line comment that can be combined",
  code: `
// I love cookies.
// But not cake.
  `,
  errors: [{ messageId: "incorrectlyFormatted" }],
  output: `
// I love cookies. But not cake.
  `,
});

invalid.push({
  name: "Using a multi-line comment that has many code blocks",
  code: `
// But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born

// and I will give you a complete account of the system, and expound the actual teachings of the great
// explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure

// itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally
// encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or
// desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur
  `,
  errors: [
    { messageId: "incorrectlyFormatted" },
    { messageId: "incorrectlyFormatted" },
    { messageId: "incorrectlyFormatted" },
  ],
  output: `
// But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was
// born

// and I will give you a complete account of the system, and expound the actual teachings of the
// great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or
// avoids pleasure

// itself, because it is pleasure, but because those who do not know how to pursue pleasure
// rationally encounter consequences that are extremely painful. Nor again is there anyone who loves
// or pursues or desires to obtain pain of itself, because it is pain, but because occasionally
// circumstances occur
  `,
});

invalid.push({
  name: "Using a multi-line comment that has many code blocks inside a function",
  code: `
function foo() {
  // But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born

  // and I will give you a complete account of the system, and expound the actual teachings of the great
  // explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure

  // itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally
  // encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or
  // desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur
}
  `,
  errors: [
    { messageId: "incorrectlyFormatted" },
    { messageId: "incorrectlyFormatted" },
    { messageId: "incorrectlyFormatted" },
  ],
  output: `
function foo() {
  // But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain
  // was born

  // and I will give you a complete account of the system, and expound the actual teachings of the
  // great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes,
  // or avoids pleasure

  // itself, because it is pleasure, but because those who do not know how to pursue pleasure
  // rationally encounter consequences that are extremely painful. Nor again is there anyone who
  // loves or pursues or desires to obtain pain of itself, because it is pain, but because
  // occasionally circumstances occur
}
  `,
});

ruleTester.run("limit-slash-slash-comments", limitSlashSlashComments, {
  valid,
  invalid,
});
