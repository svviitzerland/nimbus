# Nimbus Module Design Guide

Use this guide when adding, reviewing, or refactoring a Nimbus module. It defines the learning
experience, interactions, visual presentation, and writing standards that every contributor should
follow. Use [AGENTS.md](./AGENTS.md) for implementation details and
[CURRICULUM.md](./CURRICULUM.md) for coverage and prerequisites.

Write repository documentation in English. Indonesian text may appear as quoted UI examples.
The product itself supports both Indonesian and English.

## The learning experience

Nimbus teaches technology from zero through understandable, playable examples. A learner should
finish a lesson knowing what a concept is, where it is used, and how it works behind the interface.
They should be able to explain the result of an action they performed or observed.

Make learning enjoyable through discovery, experimentation, and clear feedback. Keep the language
friendly and the interface calm. Visuals and interaction must help explain the subject.

## Design the module before building it

A module groups related lessons into a coherent topic. Give each lesson one main learning objective
and enough context to understand it without prior technical experience.

Prepare a short design brief before implementation.

| Design question    | Required decision                                                     |
| ------------------ | --------------------------------------------------------------------- |
| Learning outcome   | What should the learner be able to explain or do afterward?           |
| Starting knowledge | Which earlier lessons provide the prerequisites?                      |
| Concrete situation | Where would this concept appear in a real system?                     |
| Visible components | Which devices, interfaces, messages, files, or data need to be shown? |
| Learner action     | What can the learner inspect, change, run, connect, or compare?       |
| Observable result  | What visibly changes because of that action?                          |
| Explanation        | How will Nim connect the result to the underlying mechanism?          |
| Recovery           | How can the learner understand and correct a failed attempt?          |
| Completion         | What observation or successful action demonstrates the objective?     |
| Scope              | Which details are simplified, and which belong in a later lesson?     |

Use [roadmap.sh](https://roadmap.sh/) to identify useful topics and gaps. Verify technical details
through primary sources. Add material because it supports understanding or a practical skill.
Keep existing lessons reusable rather than creating duplicates for each path.

## Place the module in the learning paths

Support both the General path and specialist paths.

- **General, Dari Nol.** Build from basic concepts in an order that assumes no previous experience.
- **Specialist paths.** Develop depth in a subject while including the foundations it requires.

Introduce prerequisites before depending on them. Explain new terms before asking learners to use
them. A lesson shared across paths keeps the same identity and completion record.

Follow `AGENTS.md` when registering lessons in chapters, modules, and tracks. Keep the General path
coverage complete, its ordering coherent, and its cross links valid.

## Build a complete explanation

A lesson should establish the following ideas in a natural sequence.

1. **Meaning.** Name the concept and explain it in plain language.
2. **Purpose.** Show the problem it solves or the situation in which it is used.
3. **Parts.** Identify the components and their roles.
4. **Process.** Show what happens from input or action to output or result.
5. **Experiment.** Let the learner change something relevant and inspect the consequence.
6. **Understanding.** Explain why the result occurred and what carries over to real systems.

This is an authoring sequence, not a mandatory set of headings or cards in the UI. Present only
what helps the current lesson. Split a large topic when it introduces several independent ideas.

Introduce the actual technical term alongside its plain meaning. Expand abbreviations when first
used. Explain relationships between terms, especially when similar words mean different things.
Use cross links for useful connections and later detail.

Keep each narrative beat focused. Separate optional facts with `[fyi]`. Include an `[ingat]` beat
that recalls a mechanism or distinction the learner can use again.

## Choose an interaction that explains the mechanism

Use an interaction suited to the subject.

| Learning objective          | Suitable interaction                                                                |
| --------------------------- | ----------------------------------------------------------------------------------- |
| Identify components         | Inspect labelled parts of a recognizable object and see each part's role.           |
| Understand a sequence       | Follow a message or operation through visible stages, then change a relevant input. |
| Understand cause and effect | Change one condition and observe its effect on the same system.                     |
| Compare approaches          | Perform the same task using two approaches and compare their steps and results.     |
| Practice a tool             | Use a focused version of its real interface, command, or message format.            |
| Diagnose a problem          | Inspect evidence, choose a correction, and verify whether the system now works.     |

Show an understandable starting state. Make the available action clear and place it near the
object it affects. After the action, change the system itself and show the result.

For example, an HTTP lesson can show a browser requesting `nimbus.com/products/1`, the server
finding the product, and the resulting response. Changing the path to an unknown product should
produce a different response that the learner can inspect. Nim then explains why it changed.

A data center lesson can show servers, power, networking, and cooling. Changing one dependency
should affect the service in a visible, explainable way. A computer lesson should show recognizable
CPU, RAM, storage, input, and output components and how they work together.

For CLI and GUI, show both interfaces performing concrete tasks. For tools such as Burp Suite,
show the relevant workflow, such as capturing a request, resending it, changing a value, and
comparing responses. Tool names and screenshots alone do not teach a workflow.

A guided demonstration is appropriate for anatomy or an introduction. When a mechanism can be
explored through meaningful changes, provide that opportunity. Do not force an unrelated puzzle
into a lesson or treat pressing Next as its entire interaction.

Inspect the cloud stages and CLI/GUI lesson before introducing a new interaction pattern. Reuse
their recognizable objects, clear controls, and visible connection between actions and results.

## Feedback, failure, and completion

Feedback should explain the action just taken, the resulting state, and the reason for it. Keep it
specific. A successful result should teach as much as a failed attempt.

For a failed request, show the request, relevant response, and cause. For a configuration error,
show which setting prevents the intended behavior. Give the learner a clear way to try a correction.
Avoid dead ends that require unexplained page reloads.

Keep recovery controls within the relevant scenario. Avoid a generic experiment banner or restart
bar above every lesson. Provide instructions where the learner needs them instead of adding
permanent interface text that repeats the obvious.

Let users read the explanation while exploring. Playable lessons should remain usable from the
first beat. Track experiment completion from the actual result, and preserve the narrative
navigation behavior specified in `AGENTS.md`.

## Technical accuracy and depth

Teach the basic mechanism accurately before adding advanced detail. Use primary documentation for
standards, product behavior, and versioned material. Identify the version or edition when it changes
the meaning of the lesson.

Distinguish organizations, frameworks, tools, identifiers, and scoring systems. For example,
OWASP is an organization and the Top 10 is one of its resources. NIST is an organization and CSF is
a framework. CVE identifies a vulnerability, while CWE describes a class of weakness.

Use local simulations or an appropriate practice environment for security lessons. Show the
vulnerable behavior, observable impact, the defense, and the result after applying it. Explain the
relevant boundary of a simulation without filling the lesson with implementation notes.

For a topic with multiple versions, teach learners to recognize the version and understand the
differences. In CVSS, provide cases with observable impact before introducing metrics, vectors,
and scores. Support comparisons across relevant versions, such as 2.0, 3.0, 3.1, and 4.0, using each
version's own definitions and rules. Do not begin with an unexplained assessment form. Distinguish
technical severity from business risk and remediation priority.

Simplify deliberately. Keep the cause and effect truthful, and identify important limitations.
Do not present illustrative numbers, simulated behavior, or a successful toy example as a guarantee
about real systems.

## Writing and naming

Use plain, friendly, direct wording. Enjoyment should come from the learning experience, not
exaggerated labels, promotional phrases, repeated praise, or ambiguous fragments.

Name the concept, component, function, or action directly. Apply this to module names, lesson
titles, diagrams, panels, buttons, hints, reactions, and summaries.

| Surface         | Good Indonesian example                                          | Why it works                                  |
| --------------- | ---------------------------------------------------------------- | --------------------------------------------- |
| Module title    | Dasar Jaringan                                                   | Names the subject and level.                  |
| Lesson title    | Subnet dan CIDR                                                  | Names the concepts being taught.              |
| Component label | Memori sementara                                                 | States the relevant function.                 |
| Action          | Kirim request                                                    | Describes what the control does.              |
| Feedback        | Server mengembalikan 404 karena produk tidak ditemukan.          | Connects the outcome to its cause.            |
| Explanation     | Keyboard mengirim input ke komputer. Layar menampilkan hasilnya. | Names each component and its role explicitly. |

Keep useful technical names, such as Trojan, without dramatic modifiers. Avoid metaphors that
leave the learner guessing which component or operation is being discussed. An analogy may support
an explanation only when its mapping to the real mechanism is clear.

Memory cues should help recall the concept. For example, a subnet cue can explain that a longer
IPv4 prefix leaves fewer host bits. Use the established `Cara ingat` label consistently.

Keep Indonesian and English aligned in meaning, actions, and outcomes. Put lesson copy in the
language files, including small labels and feedback. Follow the punctuation rules in `AGENTS.md`.
Preserve required syntax in code, URLs, network addresses, and protocol vectors.

## Visual design

Maintain the established Nimbus identity and reuse its components.

- Keep Nim as a separate character and use the cloud-shaped speech bubble.
- Place the lesson title outside the bubble, in the title HUD.
- Size the bubble for the text currently shown. Avoid excessive padding, tall minimum heights,
  or sizing based on hidden paragraphs.
- Split long explanations into coherent beats instead of reducing text size.
- Keep the main action easy to find. Nim and the bubble must not cover controls or important results.
- Use recognizable, labelled objects such as a browser, computer, network device, or server rack.
  Show their relationships clearly.
- Use `nimbus.com` for example sites and addresses.
- Use the existing palette and typography tokens. Keep decoration restrained and meaningful.
- Keep animation understandable, interruptible where appropriate, and compatible with reduced motion.
- Arrange stages vertically and centrally on phones. Prevent horizontal overflow and clipped controls.

Use progressive disclosure for advanced details. Establish the situation visually before asking
for configuration. A form is appropriate when learners understand what its fields mean and why
they are changing them.

## Implementation and review

Keep curriculum data, language strings, reusable components, and route glue separate. Follow the
stage contract in `AGENTS.md`. Reuse existing components before introducing a new visual system.
Keep useful mechanics when refactoring a lesson.

Before shipping a module, verify these outcomes.

- A beginner can follow the terminology and prerequisite order.
- The visual shows the parts and process described by the narrative.
- Each meaningful action produces the expected observable result.
- Success and failure feedback explain the mechanism and support recovery.
- Completion follows the actual task result.
- Labels are clear throughout, including small controls and secondary panels.
- Both languages provide equivalent teaching and working interactions.
- Cross links, module registration, path order, and shared progress remain correct.
- Phone and desktop layouts remain readable, with usable keyboard focus and accessible controls.
- The bubble fits its content and does not obstruct the lesson.

Run `bun run check` and require 0 errors and 0 warnings. Run `bun run check:curriculum` for content
or path changes and `bun run test:lessons` when simulation models change. Build the application and
exercise the affected interactions in a browser, including relevant failure states, navigation,
language changes, and screen sizes.

Review the whole affected module rather than fixing only one quoted sentence. Preserve good
material, improve recurring problems consistently, and report exactly what was changed and tested.
