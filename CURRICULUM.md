# Nimbus Curriculum

The lesson roadmap. Nimbus teaches the technology behind the internet from absolute zero, like a
game. Nim guides the learner, every concept is tied to something real, and each lesson ends in an
interactive stage the learner actually plays with.

It started as one cloud path and is growing into a platform with several subjects. The topic
list is shaped after [roadmap.sh](https://roadmap.sh) (Cyber Security, Frontend, Backend, DevOps,
AI Engineer, SQL, Linux), trimmed to what a beginner needs first.

Legend: [x] shipped, [ ] planned, (opt) optional or advanced.

## How it is organized

Two layers, both in code.

- **Module** (`src/lib/modules.ts`). One topic, an ordered list of lessons. Database, Git, and
  Cryptography are modules. A lesson is written once and a module can sit in several tracks.
- **Track** (`src/lib/tracks.ts`). Modules lined up for one goal, like "I want to build websites".
  The learner picks a track right after Nim's welcome, and can switch any time from the menu.

Four rules hold everything together.

1. **Only Dari Nol starts at the computer itself.** A topic track goes straight to its subject
   and opens with only the few foundations it truly needs (Client and Server for everyone, the
   Code module for Web, Network Essentials for Cloud and Security). The story of computers and
   what is inside one live in Dari Nol.
2. **Done once, done everywhere.** Progress is keyed by lesson, so Firewall finished in the Network
   track is already ticked in Security and Cloud.
3. **Cross links instead of forced detours.** When a lesson touches another subject, Nim drops a
   chip like `[[HTTPS|security:tls]]`. The learner can jump now (and Nim brings them back to the
   same beat) or keep going and meet it later in their own track.
4. **Dari Nol (General) is the safe default.** For someone who does not know where to start, it
   covers every lesson of every track in one blended path, so nothing is missed.

## Scope, compared with roadmap.sh

| roadmap.sh area                                            | In Nimbus                                                                     | Why                                                                          |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Absolute Beginners, Computer Science                       | Basecamp modules (How a Computer Works, How a Computer Understands Code)      | Beginners need the core idea (hardware, 0 and 1, compilers), not a CS degree |
| Languages / Platforms                                      | Not a track. One Basecamp module on how code becomes something a machine runs | Nimbus teaches concepts, a language course would be a different product      |
| Web Development, Frameworks                                | **Web** track, frameworks are one module inside it                            | Frameworks only make sense once HTML, CSS, JS, and backends are clear        |
| Databases                                                  | A module shared by Web, Cloud, and AI                                         | For a beginner a database is always used together with something             |
| DevOps                                                     | Inside **Cloud & DevOps**                                                     | Containers, CI/CD, and monitoring are already half of the cloud chapters     |
| Cyber Security                                             | **Security** track                                                            | A core subject on its own, and it builds on network and web                  |
| AI and Machine Learning                                    | **AI & ML** track, ML is a module inside it                                   | ML is one way to build AI, see the nesting below                             |
| Networking (inside the Cyber Security and DevOps roadmaps) | **Network** track, including a router lab on MikroTik or Cisco                | The base of everything, and very practical (offices, ISPs, RT RW net)        |
| Design                                                     | One module inside Web                                                         | Enough UI and UX to build something people enjoy using                       |
| Mobile                                                     | One module at the end of Web                                                  | Native versus web versus cross platform, a full track later                  |
| Game Development, Blockchain                               | Parked. Blockchain gets one lesson in Cryptography                            | Niche for now and hard to make playable without heavy tooling                |
| Management, Best Practices                                 | Out                                                                           | Not what Nimbus is for                                                       |

**Where machine learning sits.** AI is the umbrella. Machine learning is one way to build AI
(learning from examples instead of hand written rules). Deep learning is a kind of machine learning
built on neural networks. Generative AI (LLMs, chatbots, image generators) is built on deep
learning. The AI & ML track teaches them as nested modules, from the outside in.

## The lesson pattern (every lesson follows this)

- One clear concept per lesson. If it needs two ideas, split it into two lessons.
- A real world tie. No empty jargon. Always answer "what is this in reality?"
- Nim narrates in short paginated beats (`intro: string[]`), then reacts to what the learner
  does on the stage (`reactions` via `onstate`).
- An interactive stage that reacts in real time. The learner does something and sees the
  consequence, not just reads about it.
- Bilingual (Indonesian and English), with language separated from content per lesson
  (`index.ts` config, `id.ts` and `en.ts` text). See AGENTS.md for the recipe and design rules.
- Attack lessons are always shown from the defender's side, inside a sandbox, never against a
  real target.

# Tracks

| Track                   | For someone who                                 | Basecamp                              | Then                                                                                                                             |
| ----------------------- | ----------------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Dari Nol** (General)  | Does not know where to start                    | Everything                            | Every subject once, in order                                                                                                     |
| **Jaringan** (Network)  | Wants to know how data moves, or runs a network | Client and Server                     | Network basics, addressing, routing and protocols, capacity, network security, network lab (MikroTik or Cisco), troubleshooting  |
| **Web**                 | Wants to build websites and apps                | Code, Client and Server               | How the web works, frontend, design, frameworks, backend, database, deploy, mobile                                               |
| **Cloud & DevOps**      | Wants to run apps on rented servers             | Client and Server, Network Essentials | Cloud, resilience, storage, capacity, scaling, cloud networking, containers and serverless, Linux, DevOps, operations, providers |
| **Keamanan** (Security) | Wants to protect systems and data               | Client and Server, Network Essentials | Security basics, identity, cryptography, attacks, defense, ethical hacking                                                       |
| **AI & ML**             | Wants to know how machines learn                | Client and Server                     | AI basics, machine learning, deep learning, generative AI, AI in practice                                                        |

**Dari Nol covers everything.** It is not a sixth subject, it is every lesson of every track in
one blended path, grouped into chapters (Bab) by what is easiest to learn next rather than by
subject. A learner who follows it never has to choose, and meets HTML right after learning what a
server is, the router lab right after networking, and AI once data and the cloud are familiar. The order
lives in `GENERAL` in `src/lib/tracks.ts` and reads like a story, each chapter using only what came
before. A few lessons refer back to earlier ones (CDN remembers latency from the Cloud chapter), so
those stay after the lesson they mention.

1. Computers
2. Code
3. The Internet
4. Network Data Flow
5. The Web
6. Frameworks
7. Backends and APIs
8. Data
9. Git and Collaboration
10. Site Deployment
11. Servers and Linux
12. Cloud
13. Traffic
14. Private Networks
15. Network Lab
16. Security Basics
17. Cryptography
18. Attacks and Defense
19. Security References and Assessment
20. Web Security Lab
21. Compute and DevOps
22. AI Basics
23. Deep Learning and Generative AI
24. Crossroads

**Same word, different world.** When a concept exists in more than one place, the lesson says so
with an `[fyi]` beat and a cross link, so the learner is ready for both. Port explains logical
ports (80, 443) versus physical ports (ether1 on a MikroTik or Cisco). Private networks compares a
cloud VPC with an on premise office built from subnets, VLANs, and a router. Firewalls compares a
cloud security group with a firewall on a router. New lessons follow the same habit.

**Status.** Every lesson in every module is shipped and playable. What stays planned is the deeper provider content (one full track per provider, below) and the ideas parked at the end.

# Basecamp modules

Shared foundations. Short, two to four lessons each, and they open every topic track.

## How a Computer Works (Cara Komputer Bekerja)

- [x] **CPU, RAM, and storage**. CPU executes instructions, RAM holds active data, and storage
      retains files after power is removed. Stage: inspect the labelled parts of a laptop and
      follow their roles when a program runs.
- [x] **Bits and bytes**. A bit is a switch, eight make a byte, and letters, photos,
      and songs are all long rows of switches. Stage: flip eight switches to spell a letter of
      nimbus, then see how many bytes a photo and a movie take (KB, MB, GB).
- [x] **Operating systems**. Windows, macOS, Linux, and Android are the manager between apps
      and hardware, sharing out CPU, memory, and files. Stage: open several apps on the laptop and
      watch the OS share the CPU and RAM between them, until one too many makes it slow.

## How a Computer Understands Code (Cara Komputer Memahami Kode)

- [x] **What is a program**. Code is a list of exact steps; the computer follows them literally
      and never guesses. Stage: give Nim step by step commands to make tea, a missing step makes Nim
      do something silly, the same way a bug does.
- [x] **Variables, functions, and lists**. Store and change named values, inspect data types and collections, then call a function with different inputs and compare its output.
- [x] **Programming languages**. Machines only run 0 and 1, people write in friendlier
      languages, and each one trades ease for speed or suits a job (Python for data, JavaScript for
      the browser, C for speed). Stage: the same tiny task written in machine code, C, and Python,
      side by side, and how short each one is.
- [x] **Compilers and interpreters**. A compiler translates the whole book before you read it (C,
      Go), an interpreter translates line by line while you read (Python, JavaScript). Stage: run
      one program both ways, watch the compiled one wait then race, and the interpreted one start at
      once then walk, and see where a typo is caught in each.
- [x] **Runtimes and libraries**. Code needs a runtime to run (Node, the JVM, the browser) and
      borrows ready made pieces (libraries, installed through npm or pip). Stage: build an app from
      scratch versus by plugging in libraries, then see a library update break it.

## Client and Server (Client dan Server)

Shipped in Chapter 1. [x] Server, [x] Request journey, [x] Port.

## Developer Tools (Alat Developer)

Shipped in Chapters 1 and 7. [x] CLI vs GUI, [x] Version control (Git), [x] Git is not GitHub,
[x] Not only GitHub, [x] Branches and merge conflicts, [x] Pull requests and code review.

## Network Essentials (Dasar Jaringan)

A short version of the network track for Cloud and Security learners.

- [x] **IP addresses**. Every device on a network has an address like a house number; public ones
      are reachable from the internet, private ones only inside your home. Stage: look up the IP of
      the phone, the laptop, and the router, then see which ones a stranger can reach.
- [x] **IP and DNS** (Chapter 6), [x] **Layers and packets** (Chapter 6).

# Track: Network

How data moves, from the cable in the wall to the router in an office. Follows the networking parts
of the roadmap.sh Cyber Security and DevOps roadmaps, plus a hands on router lab.

## Network Basics (Dasar Jaringan)

- [x] **LAN, WAN, and the internet**. A home or office is a LAN, a city of offices linked together
      is a WAN, and the internet is a network of networks. Stage: zoom out from one room to a
      building, a city, and the world, wiring each level together.
- [x] **Network devices**. The modem or ONT talks to the ISP, the router
      picks the way out, the switch connects cables inside, the access point turns it into WiFi.
      Stage: build a small office by dragging each box into place, and watch what breaks when one is
      missing.
- [x] **Network cables**. Copper carries electricity, fibre carries light, and that is
      why fibre goes further and faster. Stage: send the same file over copper and fibre across
      growing distances and watch the copper signal fade.
- [x] **Cable** (Chapter 2).
- [x] **What is WiFi**. WiFi is radio; 2.4 GHz goes through walls, 5 GHz is faster but
      shorter, and neighbours on the same channel get in each other's way. Stage: move a phone
      around a house plan and watch speed change with walls, distance, and band.

## Addressing (Pengalamatan)

- [x] **MAC addresses and ARP**. Inside a LAN, devices find each other by the hardware address
      (MAC) on their network card; ARP asks "who has this IP?" to learn it. Stage: the laptop shouts
      an ARP question to the room and only the printer answers.
- [x] **IP and DNS** (Chapter 6).
- [x] **IPv4 and IPv6**. IPv4 has about 4 billion addresses, far fewer than devices,
      so IPv6 brings an almost endless supply. Stage: hand out IPv4 addresses to a growing crowd
      until they run out, then switch to IPv6.
- [x] **Subnets and CIDR**. A network is cut into smaller rooms, and the /24 at the end says how big
      each room is. Stage: slide the /number and watch one network split into rooms, and how many
      devices fit in each.
- [x] **What is DHCP**. A new device asks for an address and the DHCP
      server lends one for a while. Stage: devices join a cafe WiFi one by one and receive their
      lease, then the pool runs dry.
- [x] **What is NAT**. Your whole home shares one public IP; the router rewrites each
      packet and remembers who asked. Stage: three phones browse at once and the router keeps a
      translation table so every reply finds its way back.

## Routing and Protocols (Routing dan Protokol)

- [x] **Layers and packets** (Chapter 6).
- [x] **Routers and routing**. A router reads the destination and looks up the next hop in
      its table, like a signpost at every junction. Stage: write a few routes and send a packet,
      then delete a route and watch it get lost.
- [x] **Dynamic routing** (opt). Routers can tell each other about roads by
      themselves; OSPF inside one company, BGP between whole networks on the internet. Stage: cut a
      link and watch routers find a new way on their own, then the story of a real BGP outage.
- [x] **What is a VLAN**. One physical switch split into separate virtual networks,
      so guests never see the finance team. Stage: colour ports by VLAN and test who can reach whom.
- [x] **Network protocols**. HTTP for web, SMTP and IMAP for email, FTP and SFTP for files, SSH for
      remote login, each with its own port. Stage: send an email and a file and open a site, and
      see each protocol travel through its own door (ties back to Port).

## Capacity (Kapasitas)

- [x] **Ingress and egress**, [x] **Bandwidth and throughput**, [x] **Bottleneck** (Chapter 4).
- [x] **What is QoS**. When the line is full, a router can let video calls through first
      and make downloads wait. Stage: a busy office line with a call, a game, and a big download;
      turn on QoS and the call stops stuttering.

## Network Security (Keamanan Jaringan)

- [x] **Private networks and subnets**, [x] **Firewalls** (Chapter 6).
- [x] **What is a VPN**. A VPN wraps your traffic in an encrypted tunnel to another network,
      so working from a cafe feels like sitting in the office. Stage: reach an office server from a
      cafe, blocked without the VPN and allowed through the tunnel, while a snooper sees only noise.
- [x] **WiFi security**. WPA2 and WPA3 passwords, a separate guest network, and why an open cafe
      WiFi is risky. Stage: set up a home router, compare an open, a WPA2, and a WPA3 network from a
      snooper's laptop.

## Network Lab (Lab Jaringan)

A simulated router, so the learner configures a real looking device without owning one. The lab
opens with a choice of gear, because the ideas are the same everywhere and only the commands
differ. Every lab ends with a working office network, and each step maps to a concept learned
earlier. A track plays the lab the learner picked; the other one stays in the menu (marked as the
other option), and opening any of its lessons switches to it. The choice is stored as `lab` in
`path.choices`, and lab modules are marked with `variant: { choice: 'lab', option }` in
`src/lib/modules.ts`.

- [x] **Pick your lab gear**. MikroTik (RouterOS, the favourite of ISPs and neighbourhood networks)
      or Cisco (IOS, the king of office networks and the footing for CCNA). Stage: two devices,
      tap one to pick.

### MikroTik Lab (Lab MikroTik)

- [x] **What is MikroTik**. What RouterOS is, why ISPs, offices, and RT RW net love it, and the two
      ways in (Winbox clicks versus the terminal, tying back to CLI vs GUI). Stage: log into the
      simulated router and find its interfaces (ether1 to the ISP, the others to the office).
- [x] **IP addresses and DHCP server**. Give the router its addresses and let it hand out IPs to the
      office. Stage: plug laptops in, see them get nothing, add the DHCP server, and watch them get
      addresses.
- [x] **NAT and masquerade**. A NAT masquerade rule lets the whole office share one
      public IP. Stage: laptops have IPs but no internet, add the rule, and the sites load.
- [x] **Firewall filters**. Filter rules on the input and forward chains, block a site,
      protect the router itself. Stage: block a game site for staff and lock Winbox to the admin's
      laptop only, then test from both.
- [x] **Bandwidth management**. Simple queues give each user a fair slice so one downloader does
      not ruin everyone's call. Stage: one heavy downloader hogs the line, add a queue per user, and
      everyone's bar evens out.
- [x] **Hotspot**. A cafe style hotspot with vouchers and a login page. Stage:
      a phone joins, lands on the login page, enters a voucher, and gets online for one hour.

### Cisco Lab (Lab Cisco)

A simulated Cisco IOS with its real modes (user EXEC, enable, configure, interface), abbreviations,
and error messages, on the same nimbus office.

- [ ] **What is Cisco**. Cisco and IOS, the modes, physical interfaces versus logical ports.
      Stage: set the hostname, `show ip interface brief`, save the config.
- [ ] **Interfaces and DHCP pools**. Address the LAN interface, `no shutdown`, and a DHCP pool so
      the office laptops get addresses.
- [ ] **NAT overload**. Inside and outside interfaces and one rule that lets the whole office share
      one public address.
- [ ] **Access control lists**. Standard versus extended ACLs, first match wins, the implicit deny,
      and locking remote admin to the admin laptop.
- [ ] **VLANs and trunks**. On a Cisco switch, VLANs per team, access ports, and a trunk to the
      router.
- [ ] **SSH and enable secret**. Lock the device down with an enable secret, RSA keys, local users,
      and SSH only on the vty lines, and why Telnet is unsafe.

## Troubleshooting

- [x] **Ping and traceroute**. Ping asks "are you there and how far?", traceroute lists every hop on
      the way. Stage: ping nimbus.com, then traceroute it and see each hop light up on a map.
- [x] **What is Wireshark** (opt). Capture real traffic and read it layer by layer.
      Stage: capture a page load and click each packet to see its layers (ties back to Layers).
- [x] **Network troubleshooting**. Troubleshoot bottom up, cable, WiFi, IP, gateway, DNS, then the
      site. Stage: a broken setup with one hidden fault, the learner runs checks until it is found.

# Track: Web

From the page you see to the server and database behind it. Follows the roadmap.sh Frontend and
Backend roadmaps, at concept level, with tiny editable code on the stage (change one line, see the
result) instead of a full language course.

## How the Web Works (Cara Web Bekerja)

- [x] **What is HTTP**. The browser asks with a method (GET to read, POST to send)
      and the server answers with a status (200 fine, 404 not found, 500 broken). Stage: send
      different requests to nimbus.com and read each answer and its status.
- [x] **How a browser works**. It downloads HTML, CSS, and JS, then builds and paints the page.
      Stage: slow motion page load, watching the skeleton, then the colours, then the moving parts
      arrive.
- [x] **Domains and hosting**. Buying nimbus.com from a registrar, pointing it at a host, and what
      shared hosting, a VPS, and the cloud mean. Stage: buy the domain, choose a host, connect them.
- [x] **IP and DNS** (Chapter 6).

## Frontend

- [x] **What is HTML**. Tags give the page its structure, a heading, a paragraph,
      an image, a button. Stage: build the nimbus.com home page by stacking blocks, and see the HTML
      appear beside it.
- [x] **What is CSS**. Colours, fonts, spacing, and layout. Stage: the bare page from
      the last lesson, change one CSS line at a time and watch it dress up.
- [x] **What is JavaScript**. Code that reacts when you click, type, or scroll. Stage:
      make the add to cart button count up, then break a line and see the button go dead.
- [x] **The DOM and events**. The browser keeps the page as a tree that JavaScript can change, and
      events are the signals that something happened. Stage: click on the page and watch the event
      travel the tree and change one branch.
- [x] **Responsive design**. Responsive layouts reflow for every screen size. Stage: drag the
      screen from phone to laptop width and watch the layout rearrange.
- [x] **Accessibility**. Accessibility, contrast, labels, keyboard use, and screen readers.
      Stage: use nimbus.com blindfolded with a screen reader voice, then fix the parts that fail.

## Design (Desain)

- [x] **UI and UX**. UI is how it looks, UX is how it feels to use. Stage: two checkout pages that
      look alike, the learner tries both and feels which one is easier, then sees why.
- [x] **Design to code**. A designer's file (Figma) has sizes, colours, and spacing that become
      CSS. Stage: inspect a design and copy its values into the page until they match.

## Frameworks (Framework)

- [x] **What is a framework**. Writing every page by hand gets messy, frameworks give a ready
      structure (React, Vue, Svelte, Angular for the browser). Stage: update a price in ten places by
      hand versus in one place with a framework.
- [x] **Components**. A page is built from reusable pieces like a card or a button.
      Stage: build a product list by reusing one card component with different data.
- [x] **CSR, SSR, and SSG**. Client side, server side, and static rendering,
      and how each feels on a slow phone. Stage: load the same page three ways on a slow connection.
- [x] **Build tools**. A build step bundles and shrinks your files before they go
      online. Stage: press build and watch many files squeeze into a few small ones.

## Backend

- [x] **What is a backend**. The part you never see, it checks logins, saves orders, talks to the
      database, and sends emails. Stage: place an order on nimbus.com and follow it through the
      backend step by step.
- [x] **API**, [x] **REST**, [x] **GraphQL**, [x] **gRPC**, [x] **WebSocket**, [x] **Webhook**
      (Chapter 1, API sub section).
- [x] **Sessions, cookies, and tokens**. After you log in, the server remembers you with a session
      cookie or a token (JWT). Stage: log in, browse, then delete the cookie and get logged out.
- [x] **Backend frameworks**. Laravel, Express, Django, Spring, and what they handle for you
      (routing, database access, security). Stage: the same order endpoint by hand versus in a
      framework.
- [x] **Queues and background jobs**. Slow work like sending email or resizing photos goes to a
      queue so the visitor does not wait. Stage: checkout with and without a queue and compare how
      long the visitor waits.

## Database

- [x] **Databases (SQL versus NoSQL)** (Chapter 3).
- [x] **What is SQL**. SELECT, WHERE, and ORDER BY to ask a table questions. Stage: a nimbus
      products table, answer questions by building queries from blocks.
- [x] **Kinds of SQL commands**. DDL builds the shape of a table (CREATE, ALTER, DROP), DML works
      with its rows (INSERT, SELECT, UPDATE, DELETE), DCL decides who may do what (GRANT, REVOKE),
      and TCL saves or cancels (COMMIT, ROLLBACK). Stage: one nimbus users table built, filled,
      locked, and erased command by command.
- [x] **Relations and JOIN**. Keys connect customers to orders to products, and a JOIN
      brings them back together. Stage: draw the links, then join them to see who bought what.
- [x] **Database indexes**. An index is the index at the back of a book. Stage: search a
      million rows with and without an index and race the two.
- [x] **Database transactions**. A payment either fully happens or not at all. Stage: move
      money between two accounts, crash halfway, and see the money vanish without a transaction.
- [x] **OLTP and OLAP**. The app database handles many small quick writes, while the analytics
      side reads huge amounts to answer big questions. Row versus column storage, the data
      warehouse, and the nightly ETL copy. Stage: orders pour into the app database, a big question
      slows checkout, then a warehouse takes over.
- [x] **Caching and Redis**. Keep hot answers in fast memory. Stage: a slow product page, add a
      cache, and watch repeat visits get instant (ties back to Caching and CDN).

## Deploy

- [x] **Laptop as a server**, [x] **Tunneling** (Chapter 1).
- [x] **Deploying a site**. Push the code and a host (Vercel, Netlify, or a VPS) builds and
      serves it at nimbus.com. Stage: push, watch the build, and open the live site on a phone.

## Mobile

- [x] **Native and cross platform**. Kotlin and Swift apps, websites in a browser, and Flutter
      or React Native in between, with their trade offs. Stage: build one app three ways and compare
      speed, reach, and effort.
- [x] **What is a PWA**. A PWA is a website that installs like an app and works offline.
      Stage: install nimbus.com on the phone home screen, turn off the internet, and it still opens.

# Track: Cloud & DevOps

Rent servers, spread them worldwide, automate every release. DevOps lives here because its tools
(containers, CI/CD, monitoring) run on the cloud. Follows the roadmap.sh DevOps roadmap.

## Shipped modules

- **Cloud**. [x] Virtual machine, [x] Cloud, [x] Remote access, [x] Cloud services, [x] Region.
- **Resilience**. [x] Availability Zone, [x] Failover, plus
  [ ] **Backup and recovery**. Copies kept elsewhere, and the 3 2 1 rule (three copies, two kinds
  of storage, one off site). Stage: a server dies, restore from yesterday's backup and see what
  data was lost since then.
- **Storage**. [x] Storage types, [x] Databases.
- **Capacity**. [x] Ingress and egress, [x] Bandwidth and throughput, [x] Bottleneck.
- **Scaling**. [x] Reverse proxy, [x] Load balancer, [x] Scaling, [x] Auto scaling,
  [x] Caching and CDN.
- **Cloud Networking**. [x] Private networks, [x] Firewalls, [x] Identity and Access,
  [x] Shared responsibility.
- **Containers and Serverless**. [x] Containers, [x] Microservices, [x] Serverless.

## Linux

Most servers run Linux and are driven from a terminal, so this builds on CLI vs GUI.

- [x] **The Linux file system**. One tree starting at /, with home, etc, and var, and how to
      move around it. Stage: a real looking terminal, find a log file by walking the tree.
- [x] **Permissions and sudo**. Read, write, and run for owner, group, and others, and sudo for
      admin powers. Stage: a file you cannot open, fix its permission, then try the risky way.
- [x] **Package managers**. A package manager downloads, installs, and updates software
      in one command. Stage: install a web server with one line and open its welcome page.
- [x] **Processes**. Inspect PIDs and resource usage with ps and top, then stop a practice process.
- [x] **Pipes and grep**. Connect command output to another command, filter a log, and inspect a file in an editor.
- [x] **Services and systemd**. systemd starts a program at boot and restarts it if it dies.
      Stage: start the web server, crash it, and watch systemd bring it back.
- [x] **Shell scripts**. Save a list of commands in a file and run them all at once. Stage: automate
      a daily backup that was being typed by hand.

## DevOps

- [x] **What is DevOps**. Developers and operations used to throw work over a wall; DevOps is one
      team shipping small changes often and safely. Stage: release once a year versus every day,
      and count how big and scary each release is.
- [x] **CI/CD** (Chapter 7).
- [x] **Infrastructure as Code**. Describe servers in a file (Terraform) and the tool builds them,
      the same every time. Stage: click to build three servers by hand, then write them as code and
      rebuild them in one go after a disaster.
- [x] **Configuration management** (opt). Tools like Ansible set up a hundred servers the same
      way. Stage: update ten servers one by one versus with a single playbook.
- [x] **What is Kubernetes**. It places containers on machines, restarts the ones
      that die, and scales them. Stage: declare "keep five copies", kill two, and watch Kubernetes
      bring them back.
- [x] **Release strategies**. Blue green and canary releases send a new version to a few
      users first. Stage: release a buggy version to 5 percent, see the errors, and roll back before
      everyone is hit.

## Operations (Operasi)

- [x] **Monitoring** (Chapter 7).
- [x] **Centralized logging**. Every server's logs collected in one searchable place. Stage: an error on
      one of twenty servers, find it by searching the central log instead of logging in to each.
- [x] **Incidents and on call**. On call, incidents, and the blameless post mortem after.
      Stage: an alarm fires, follow the runbook, fix it, and write what you learned.
- [x] **Cost** (Chapter 7).

## Provider Branch (Cabang Provider)

- [x] **Pick a provider**, then the AWS, Google Cloud, and Azure branches below.

# Track: Security

How attackers think, how data is locked, and how systems are kept safe. Follows the roadmap.sh
Cyber Security roadmap, always from the defender's side.

## Security Basics (Dasar Keamanan)

- [x] **The CIA triad**. The CIA triad, keep data secret, unchanged, and reachable,
      and every attack breaks at least one. Stage: sort real incidents (a leak, a defaced site, a
      site knocked offline) into the three buckets.
- [x] **Threat modeling**. Find the weakest door before someone else does (threat
      modeling). Stage: look at the nimbus.com shop diagram and mark every place an attacker could
      try, then compare with Nim's list.
- [x] **Types of hackers**. The same skills, used with permission or without, and why
      the law cares about the difference. Stage: a few short scenarios, decide which ones are legal.

## Identity (Identitas)

- [x] **Identity and Access** (Chapter 6).
- [x] **Passwords and hashing**. Servers should keep a one way fingerprint (hash) of your password,
      never the password itself, and a salt stops lookup tables. Stage: register on two sites, one
      leaks plain passwords and one leaks hashes, and see what the attacker gets from each.
- [x] **What is MFA**. A second factor (an app code or a security key) stops a stolen password.
      Stage: an attacker with the right password still gets stuck at the second step.
- [x] **SSO and OAuth**. SSO and OAuth let one trusted account vouch for you, without handing
      your password to every site. Stage: sign into nimbus.com with Google and see what is shared.

## Cryptography (Kriptografi)

- [x] **Encryption** (Chapter 6).
- [x] **Symmetric and asymmetric keys**. One shared key versus a public padlock anyone can close and
      a private key only you can open. Stage: send a secret to a friend both ways and see why
      sharing one key over the internet is the hard part.
- [x] **SSL, TLS, and certificates**. The handshake behind the padlock, and how a certificate proves
      nimbus.com is really nimbus.com. Stage: watch a TLS handshake step by step, then visit a fake
      site with a bad certificate and see the browser warning.
- [x] **Digital signatures**. Sign with your private key so anyone can check a message is from you
      and was not changed. Stage: sign an app update, tamper with it, and watch the check fail.
- [x] **What is blockchain** (opt). Blocks chained by hashes, so changing an old one breaks
      every block after it. Stage: edit an old block and watch the chain turn red.

## Attacks (Serangan)

- [x] **Sniffing and MITM**. On open WiFi, unencrypted traffic can be read by anyone nearby
      (sniffing, and man in the middle). Stage: a cafe WiFi with a snooper, browse an HTTP site and
      an HTTPS site and compare what the snooper sees.
- [x] **What is phishing**. Tricking people is easier than breaking code. Stage: an
      inbox of real looking emails, spot the fakes by their clues (sender, link, urgency).
- [x] **Brute force**. Brute force and credential stuffing, and why long
      passwords and rate limits win. Stage: set a password and watch how long a guessing machine
      needs, then add length and a lockout.
- [x] **SQL injection and XSS**. When a site trusts what you type, typed text can turn into code.
      Stage: a deliberately weak login and comment box in a sandbox, see the attack work, then
      switch on the fix and watch it fail.
- [x] **Malware and ransomware**. Programs that spy, steal, or lock your files for ransom. Stage: a
      laptop opens a bad attachment, files lock one by one, then restore from backup.
- [x] **What is DDoS**. Flooding a site with fake traffic until real visitors cannot get in. Stage:
      a flood hits nimbus.com, then turn on a CDN shield and rate limits (ties back to Traffic).

## Defense (Pertahanan)

- [x] **Firewalls** (Chapter 6).
- [x] **Server hardening**. Hardening, update often, close unused ports, SSH keys instead of
      passwords, least privilege. Stage: a fresh server full of open doors, close them one by one
      while a scanner score improves.
- [x] **IDS and IPS**. An IDS notices suspicious traffic, an IPS also blocks it.
      Stage: normal traffic with an attack hidden inside, tune the guard to catch it without
      blocking real visitors.
- [x] **Logs and SIEM**. A SIEM gathers logs and raises alerts when a pattern looks like
      an attack. Stage: a wall of log lines, find the brute force attempt hiding in it.
- [x] **Incident response**. Incident response, contain, clean, recover, and learn. Stage: a
      breach alarm, choose the steps in the right order and see the damage grow when you pick wrong.
- [x] **Shared responsibility** (Chapter 6).

## Ethical Hacking

- [x] **Pentesting and bug bounties**. Companies pay people to find holes legally, with written
      permission and scope. Stage: read a mini scope, decide what is allowed to test, and write a
      short report for a found bug.
- [x] **What is a CTF**. Capture the flag puzzles are a safe playground to practice. Stage:
      a tiny beginner CTF built from the attacks in this track.

# Track: AI & ML

How a machine learns from examples, up to chatbots. Follows the roadmap.sh AI Engineer and AI and
Data Scientist roadmaps at concept level, no maths beyond what a picture can show.

## AI Basics (Dasar AI)

- [x] **What is AI**. The nesting, AI the umbrella, ML learns from examples, deep
      learning uses neural networks, generative AI creates new content. Stage: sort real products
      (a spam filter, a chess bot, ChatGPT, a face unlock) into the nested circles.
- [x] **Data and datasets**. A model is only as good as its examples, and bad data makes bad AI.
      Stage: train a cat detector on a tidy set and a messy set, and compare what each gets wrong.

## Machine Learning

- [x] **What is machine learning**. Instead of writing rules, show many labelled examples and let the
      machine find the pattern (training). Stage: label fruit photos, train, and watch the model
      start guessing new ones.
- [x] **Regression and classification**. Regression predicts a number (a house price), classification
      picks a group (spam or not). Stage: two mini models side by side, drag in new points.
- [x] **Supervised and unsupervised**. Supervised learning has labels, unsupervised finds groups by
      itself, reinforcement learns by reward. Stage: the same pile of dots, sorted with labels, then
      clustered without them.
- [x] **Overfitting**. Overfitting, perfect on practice, poor on new data.
      Stage: a slider for model complexity, watch the training score rise and the test score fall.
- [x] **Model evaluation**. Accuracy is not everything, false alarms versus missed cases.
      Stage: a medical style test, tune the threshold and see the trade off.
- [x] **Training and inference**. Training is slow and costly, done once; inference is answering
      each new question. Stage: train once (a long bar), then answer many questions quickly.

## Deep Learning

- [x] **What is a neural network**. Layers of tiny calculators passing numbers along, loosely inspired by the
      brain. Stage: feed a handwritten digit in and watch the layers light up toward an answer.
- [x] **Gradient descent**. It guesses, measures how wrong it was, and nudges itself a
      little, many times over. Stage: a ball rolling down a hill toward the lowest error.
- [x] **Computer vision**. Computer vision finds edges, then shapes, then objects. Stage: a photo
      broken down layer by layer until the model says "cat".
- [x] **GPUs for AI**. A GPU does thousands of small sums at once, exactly what neural
      networks need. Stage: the same training on a CPU and a GPU, racing.

## Generative AI (AI Generatif)

- [x] **LLMs and tokens**. A language model predicts the next token, one piece of a word at a time.
      Stage: type a sentence, see it split into tokens, and watch the model pick the next one from
      its top guesses.
- [x] **Prompting**. Prompting, clear instructions, examples, and context get better
      answers. Stage: improve a vague prompt step by step and compare the answers.
- [x] **Embeddings**. Words and documents become points, and similar meanings
      sit close together. Stage: a map where king, queen, and nimbus land, drag words around.
- [x] **What is RAG**. Retrieve relevant documents first, then answer from
      them, so the AI knows your own data. Stage: ask about nimbus.com's refund policy with and
      without the policy document attached.
- [x] **Fine tuning** (opt). Teach an existing model your style or task with extra examples. Stage:
      a general model versus one tuned on nimbus support replies.
- [x] **AI agents**. A model that plans, uses tools, and acts in steps. Stage: an agent books a
      meeting by calling a calendar tool, with every step shown.
- [x] **Image generation**. Image models start from noise and clean it into a picture. Stage: watch
      noise turn into an image step by step from a prompt.

## AI in Practice (AI dalam Praktik)

- [x] **AI through APIs**. Apps call a model over the internet, pay per token (ties back to
      API). Stage: send a request to a model API and read the JSON answer and its token bill.
- [x] **AI in the cloud**. GPUs are rented by the hour, and serving many users costs real
      money. Stage: a chatbot gets popular, watch the GPU bill climb, then add caching and a smaller
      model.
- [x] **Hallucination and prompt injection**. AI can sound sure and be wrong, copy unfair
      patterns from data, and be tricked by hidden instructions. Stage: catch a made up answer, then
      a document with a hidden instruction trying to hijack the bot (ties to Security).
- [x] **AI ethics**. What happens to what you type, and who owns what AI makes.
      Stage: short scenarios, decide what is safe to paste into a chatbot.

# The shipped core chapters (Konsep Inti)

The chapters as they were first built. Their lessons now live inside the modules and tracks above
(Dari Nol keeps their relative order), so this section is the detailed record of each one.

Provider neutral. The "why and how" that everything else builds on. **All shipped and playable.**

## Chapter 1: Client & Server (Client & Server) [shipped]

The physical reality under the word "cloud".

- [x] **Server**. A website is served by a computer somewhere; the client asks, the server
      answers. Stage: open a site and watch the request and response travel between phone and server.
- [x] **Request journey**. A request hops through phone, router, ISP, and the global network, and
      all the way back. Also answers the question everyone asks, if data runs on cables, what are
      the cell towers for. Only the first hop is radio (a few metres of WiFi, a few kilometres to a
      tower), and the tower itself is wired into fibre. Stage: a first person three.js animation
      (`scene/journey`) that Nim narrates. You hold the phone, the thumb comes down, and the camera
      follows the request to the router in your room or the tower down the street, into your own
      line, through the junction chamber where the ISP's cable takes over, across a seabed, and up
      to one machine in a server room, then home again. It stops at each of those for Nim to explain
      it, a board beside the picture tracks which station the request is at, and the WiFi and mobile
      data buttons swap only the first hop.
- [x] **API**. Besides a page for people, a server has an API that returns plain data (JSON) for
      programs, so apps can ask each other for data. Stage: call nimbus.com for the web page (HTML
      for humans) versus its API (real JSON for programs) and see how different the two answers look.
- [x] **Port**. A server has one address but many numbered doors (ports), one per service, like
      web on 80 and 443, SSH on 22, RDP on 3389. Stage: a building with numbered doors, tap each to
      meet the service waiting behind it, so SSH and RDP ports are known before the cloud chapter.
- [x] **Virtual machine**. One physical server sliced into many isolated virtual computers. Stage:
      split a host into VMs, allocate CPU and RAM, and feel the contention when you over allocate.
- [x] **Laptop as a server**. Your laptop can serve a site, but the home IP changes, it must stay
      on, and uploads are slow. Stage: serve from a laptop and hit each problem.
- [x] **Tunneling**. A borrowed public door (like ngrok) through a third party, fine for demos,
      not production. Stage: open a tunnel and reach the laptop from outside.
- [x] **CLI vs GUI**. Two ways to command a computer, pointing and clicking through a graphical
      interface versus typing a command in a terminal (Linux and Mac Terminal, Windows cmd or
      PowerShell). Stage: one task done both ways, open the Documents folder and see the files.
      In the GUI you click the folder in a file explorer, in the CLI you type into a real terminal
      (cd documents then ls), with friendly errors on a typo. Next unlocks once you do it both ways.

## Chapter 2: The Cloud (Cloud) [shipped]

What the cloud actually is, and what data crosses to reach it.

- [x] **Cloud**. On premise versus cloud; the cloud is just servers in a company's data center.
      Stage: compare a server at home (dies on a power cut) with one rented in the cloud.
- [x] **Remote access**. The rented server sits far away in a data center, so you log in over the
      network, through SSH (a terminal for Linux) or RDP (a desktop for Windows). Stage: connect to
      your server both ways and watch each one open.
- [x] **Cloud services**. The rented server is the core service, a virtual server (a VPS, called
      EC2 on AWS, Compute Engine on Google, Virtual Machines on Azure), and a provider offers a
      whole catalog beyond it. Stage: power on a screen and a marquee of real AWS, Azure, and
      Google Cloud service logos (EC2, S3, Lambda, BigQuery, Cosmos DB, and more) streams past.
      Sets up the chapters that follow.
- [x] **Cable**. Data crosses oceans through real undersea cables, not satellites. Stage: send
      data to a near and a far destination and follow it along the real cable route.
- [x] **Region**. Distance creates latency, so pick the region nearest your users, and each
      provider spreads its regions differently. Stage: pick a provider (AWS, Azure, Google), place a
      server in different cities, and compare a near region with a far one.

## Chapter 3: Resilience & Data (Ketahanan & Data) [shipped]

One copy in one place is fragile. Survive failures, and store data well.

- [x] **Availability Zone**. A region is not one building; it holds several isolated AZs. Opens
      with a real data center strike intro. Stage: spread servers across a region's AZs, trigger an
      outage, and watch the site survive (multiple AZs) or fall (a single AZ).
- [x] **Failover**. A whole region can be lost; keep a standby region and switch automatically.
      Stage: kill the primary with no standby (site down), add a standby, kill again, and traffic
      fails over so the site stays up.
- [x] **Storage types**. Object, block, and file storage, and when to use each. Stage: match each
      shape to the right use case.
- [x] **Databases (SQL versus NoSQL)**. Structured tables with relations versus flexible key or
      document stores, and the trade offs. Stage: model a use case in each and see which fits.

## Chapter 4: Data Flow (Aliran Data) [shipped]

How traffic flows in and out, and where it gets stuck. The primer for the Traffic chapter.

- [x] **Ingress and egress**. Data coming into a server is ingress, data leaving is egress. In the
      cloud, ingress is usually free and egress is usually billed (so downloads drive the bill).
      Stage: visitors upload photos (ingress, free) then download photos (egress, billed) while a
      live egress bill climbs, motivating caching and a CDN later.
- [x] **Bandwidth and throughput**. Bandwidth is the road's maximum capacity (the ceiling),
      throughput is what actually gets through per second. Stage: a video that goes viral; add
      viewers one by one until throughput hits the bandwidth ceiling and some buffer, then upgrade
      bandwidth so every viewer plays HD again. The wrap-up also names RPS, concurrency, and jitter.
      Latency is covered earlier in Region.
- [x] **Bottleneck**. The one point that limits everyone; under heavy traffic a queue piles up and
      the site slows or falls over. Real case of an online shop under load, shown from both sides.
      Stage: add visitors until the single database is overwhelmed (customer side shows the pages
      spinning, developer side shows the queue piling at the one database), then scale the database
      up to flow again, with a nod that widening one point has a ceiling (handled next in Traffic).

## Chapter 5: Traffic (Lalu Lintas) [shipped]

Serve many users at once without falling over.

- [x] **Reverse proxy**. A single front door that receives every request and forwards it to the
      right backend, hiding them. Stage: requests hit the proxy, which routes by path.
- [x] **Load balancer**. Spread requests across identical servers, skipping unhealthy ones. Stage:
      overload one server, add a balancer plus servers, then kill one and watch it route around.
- [x] **Scaling**. Vertical (a bigger machine) versus horizontal (more machines), and the trade
      offs. Stage: a growing workload; upgrade one box versus add more boxes.
- [x] **Auto scaling**. Add and remove capacity automatically as demand rises and falls. Stage: a
      day and night traffic curve, with capacity and the cost meter following it.
- [x] **Caching and CDN**. Keep a copy close to users to skip the long trip. Stage: a far origin
      versus a nearby edge, toggled on a world map, tying back to latency.

## Chapter 6: Networking & Security (Jaringan & Keamanan) [shipped]

How everything connects, is addressed, isolated, and kept safe.

- [x] **IP and DNS**. Every server has an address (IP); DNS turns a name into that address. Stage:
      type a domain and watch it resolve to an IP, then connect.
- [x] **Layers and packets**. Data travels in layers (the OSI stack), and the Transport layer
      breaks it into packets, delivered reliably over TCP or fast but lossy over UDP. Stage: tap up
      the OSI pyramid one layer at a time, then send four packets over TCP (all arrive, in order)
      versus UDP (fast, but one is lost and never resent), and feel the trade off.
- [x] **Private networks and subnets**. Public (internet facing) and private (internal only) areas
      of your own network. Stage: put a web server public and a database private, then test what is
      reachable.
- [x] **Firewalls**. Rules that allow or deny traffic by port and source. Stage: toggle rules and
      watch connections pass or get blocked.
- [x] **Identity and Access**. Authentication (who you are) versus authorization (what you may
      do), and least privilege. Stage: assign scoped permissions and try an allowed versus a denied
      action.
- [x] **Encryption**. Scramble data at rest and in transit so only key holders can read it. Stage:
      send data readable versus encrypted, tying back to the Cable lesson.
- [x] **Shared responsibility**. The provider secures the cloud, you secure what you put in it.
      Stage: sort responsibilities into the "provider" and "you" buckets.

## Chapter 7: Compute & Operations (Komputasi & Operasi) [shipped]

The ways to run code, and running it well without overpaying.

- [x] **Containers**. Package an app with everything it needs so it runs the same anywhere, and
      lighter than a VM. Stage: build an image and run the same container in several places.
- [x] **Microservices**. An app can be one big monolith or many small services, each its own
      container doing one job and talking over APIs, an architecture choice with real trade offs.
      Stage: in monolith versus microservices, rush checkout and break search, and watch one shape
      copy or fall as a whole while the other scales and fails one piece at a time.
- [x] **Serverless**. Write a function; the platform runs it on demand and scales to zero, you pay
      per call. Stage: compare an always on server with serverless for rare, bursty traffic.
- [x] **Monitoring**. Metrics, logs, and alarms so you know what is happening. Stage: watch the
      gauges and set an alarm.
- [x] **Cost**. Pay as you go, and right sizing to save. Stage: a live bill; turn off an idle
      server and shrink an oversized one, and watch the number drop.
      Grouped under a **Git & GitHub** sub-section in the menu, sitting just before CI/CD since a
      pipeline ships commits:

- [x] **Version control (Git)**. The messy `final`, `final_real`, `final_fix2` problem, solved by
      snapshots. Git commits a full version of your file with a note, and keeps every one. Stage:
      write, press Commit to snapshot, build up a history, then open an old snapshot and see nothing
      is ever lost.
- [x] **Git and GitHub**. Git is the tool on your laptop that makes commits (local); GitHub is
      an online place to keep and share them. Stage: commit on your laptop, push to GitHub so there
      is an online copy, then let a teammate clone it down, feeling which part is local and which is
      online.
- [x] **Git hosting services**. GitHub is one host among many; GitLab, Bitbucket, and self hosted Gitea
      all speak the same Git. Stage: tap each host to compare their flavour, then reveal why most
      people still land on GitHub (network effect, open source, portfolio, built in Actions).

- [x] **CI/CD**. A pipeline that builds, tests, and deploys every change automatically, and stops a
      broken one before it reaches users, instead of deploying by hand. Stage: ship a good change
      and watch it flow from commit to live, then ship a broken one and watch the test stage catch
      it so production stays safe.

## Crossroads and the provider branch (Persimpangan) [shipped]

- [x] **Crossroads**. The last stop of Dari Nol. With the big map in hand, the learner taps a
      branch (Network, Web, Cloud & DevOps, Security, or AI & ML), hears what is deeper inside it,
      and steps in. The pick becomes their track. Stage: the branch cards with progress per branch.
- [x] **Pick a provider**. The last stop of the Cloud & DevOps track only. Choose AWS, Google Cloud,
      or Azure for the provider branch, and leave an email to hear when it ships.

# Provider branch (Cabang Provider, inside Cloud & DevOps) [planned]

A branch at the end of the Cloud & DevOps track, not part of Dari Nol. Each provider re applies the
cloud concepts using that provider's real services, side by side so the learner sees the same idea
wearing different names, plus what is unique to each.

## Track A: AWS [planned]

- [ ] Compute: EC2, Auto Scaling, Lambda, ECS and Fargate
- [ ] Storage and data: S3, EBS, RDS, DynamoDB
- [ ] Networking: VPC and subnets, Security Groups, Route 53, CloudFront, Elastic Load Balancing
- [ ] Security and ops: IAM, KMS, CloudWatch
- [ ] AWS capstone: build the core cloud architecture with real AWS services

## Track B: Google Cloud (GCP) [planned]

- [ ] Map the same concepts to Compute Engine, Cloud Storage, Cloud SQL and Firestore, VPC,
      Cloud Load Balancing, Cloud CDN, Cloud DNS, IAM, Cloud Functions, Cloud Monitoring
- [ ] GCP capstone

## Track C: Microsoft Azure [planned]

- [ ] Map the same concepts to Virtual Machines, Blob Storage, Azure SQL and Cosmos DB, VNet,
      Azure Load Balancer and Front Door, Azure DNS, Entra ID, Functions, Azure Monitor
- [ ] Azure capstone

## Ideas parked for later

- A side by side "same concept, three providers" comparison view.
- An end to end capstone build (assemble a full architecture, then pass a traffic spike, a zone
  outage, and a far away user).
- A sandbox mode to freely build an architecture without a lesson.

## Learning audit and new experiments, November 2026

Nimbus now contains 195 lessons in 47 modules and six track choices. The picker separates a
complete From Zero path from five subject paths. Shared progress still follows the lesson, not
its track. Security now includes code, Linux, HTTP, forms, authentication, and SQL foundations
before its application security experiments. Network and Web include IP and DNS foundations.

The comparison with commit `8702f83` identified 106 simulations whose controls had been replaced
by guided slides or a single final action. Those simulations now use their original interactive
mechanics again, including request composition, code editing, query execution, network changes,
security investigations, training controls, deployment, and recovery. Their bilingual memory cues
are retained. The newer laptop teardown, router labs, and guided terminal demonstrations remain.

Playable lessons expose the experiment from the first beat. Learners can read Nim, try the
experiment, inspect feedback, return to the current story beat, and restart without losing their
place in the narrative. Reading onward is allowed. Experiment completion describes the activity;
lesson progress is saved when the learner finishes the narrative. Nim's bubble sizes to its current
message. It no longer reserves the height of the longest possible reaction.

| New lesson                          | What the learner does                                                                                               | What the result teaches                                                                           |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `cloud/data-center`                 | Interrupt mains power, consume the UPS reserve, start a generator, interrupt cooling or networking, recover service | A server depends on physical infrastructure; a region, zone, and data center are different things |
| `network/arp`                       | Send to a neighbor, send outside the subnet, reuse a cached mapping                                                 | The local frame targets a neighbor or gateway MAC while the packet retains its destination IP     |
| `web/forms`                         | Submit invalid email, bypass the browser form, enable server validation                                             | Client checks help people; server checks enforce acceptance                                       |
| `web/devtools`                      | Reproduce a missing product, inspect a 404, fix the path, reload                                                    | Diagnose from requests and responses instead of guessing                                          |
| `web/testing`                       | Run discount tests below, at, and above a boundary, change the comparison, rerun                                    | Tests compare actual behavior to a requirement and catch regressions                              |
| `security/burp-suite`               | Capture, forward, copy to Repeater, edit a path, compare responses                                                  | Proxy observes traffic; Repeater makes a controlled experiment repeatable                         |
| `security/access-control`           | Read two accounts' invoices, enforce server ownership checks, retry                                                 | Authentication does not imply authorization for every object                                      |
| `devops/secrets`                    | Inspect an exposed fake key, move it to the server, rotate, test old and new paths                                  | Moving a secret does not invalidate a leaked copy                                                 |
| `ai/data-leakage`                   | Evaluate overlapping examples, remove training IDs, reevaluate                                                      | A score can reward memorization rather than performance on unseen data                            |
| `security/risk`                     | Change exposure, data sensitivity, and permission checks                                                            | An asset, threat, weakness, and risk describe different things                                    |
| `security/mitm`                     | Compare HTTP, rejected TLS interception, and explicit lab CA trust                                                  | Encryption and certificate trust work together                                                    |
| `security/owasp`                    | Compare vulnerable and protected behavior across all ten 2025 categories                                            | OWASP Top 10 groups risks; ASVS and WSTG have different purposes                                  |
| `security/nist`                     | Assign an owner, inventory assets, prepare backups, detect, contain, restore                                        | CSF 2.0 has six continuous, related functions                                                     |
| `security/cve-cwe`                  | Match a fictional advisory against installed version and enabled feature                                            | CVE identifies an issue; CWE describes a weakness; applicability needs evidence                   |
| `security/cvss`                     | Investigate three cases, observe CIA impacts and access requirements, compare CVSS 2.0, 3.0, 3.1, and 4.0           | Severity differs from probability and remediation priority                                        |
| `security/vulnerability-management` | Prioritize three findings using severity, exposure, EPSS, and exploitation evidence, then contain, patch, retest    | A high score alone does not determine the work queue                                              |
| `security/csrf`                     | Submit a cross site request, inspect cookies, add token validation, compare a legitimate form                       | A browser sending a cookie does not prove user intent                                             |
| `security/ssrf`                     | Compare public, internal, and redirected destinations with checks on each hop                                       | A server fetching user supplied URLs needs destination controls                                   |

All eighteen additions are local simulations and have Indonesian and English copy. The interfaces
teach the actual workflow while making simplified assumptions visible. In particular, the data
center temperature and battery values are teaching values, the Burp bench makes no network
requests, and the leakage lesson uses an explicitly weak memorizer rather than a trained model.

The reference roadmaps informed the missing foundations and practical exercises, not a promise
that Nimbus replaces every professional topic on roadmap.sh. Deeper provider operations,
production troubleshooting, and extended projects remain further study. The beginner route must
remain coherent before adding more tool names.

Run `bun run check:curriculum` to verify registered paths, bilingual reaction keys, memory cues,
cross links, General coverage, and explicit prerequisite ordering. Run `bun run test:lessons` for
HTTP scope, access control, data center recovery, boundary tests, data leakage, TLS trust, CSRF, SSRF, advisory applicability, risk, and published CVSS 2.0, 3.x, and 4.0 score fixtures.

The editorial review uses direct concept titles and concrete action feedback in both languages.
It removes empty slogans, dramatic labels, and irrelevant anecdotes. Memory cues summarize the
mechanism. Example outcomes explicitly identify simplified assumptions instead of promising
complete security, free serverless execution, or factual AI output. The review also corrects
backup 3 2 1, signature verification, NAT versus firewall rules, package and service behavior,
RAG limitations, and temperature versus factual accuracy.
