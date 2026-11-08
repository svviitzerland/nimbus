# References

The sources behind Nimbus lessons, so the material is accountable and easy to keep accurate. For
each concept we lean on one primary, vendor neutral source, then compare it against the three
providers (AWS, Google Cloud, Azure). Nim always explains in his own words. We paraphrase and cite,
we never copy text or images.

Links verified June 2026.

## Primary sources (the backbone)

- **NIST SP 800-145, The NIST Definition of Cloud Computing** (public domain). The authoritative,
  vendor neutral definition with the five essential characteristics, the service models
  (IaaS, PaaS, SaaS), and the deployment models.
  [csrc.nist.gov](https://csrc.nist.gov/pubs/sp/800/145/final)
- **AWS Well-Architected Framework**. Best practices and shared vocabulary across six pillars. See
  the [framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) and
  [the six pillars](https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html).
- **Google Cloud Well-Architected Framework**. See the
  [framework](https://docs.cloud.google.com/architecture/framework) and the
  [Architecture Center](https://docs.cloud.google.com/architecture).
- **Microsoft Azure Well-Architected Framework**, plus the free Azure Fundamentals (AZ-900)
  training whose beginner structure is a good model. See the
  [framework](https://learn.microsoft.com/en-us/azure/well-architected/) and the
  [AZ-900 cloud concepts path](https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/).
- **Cloudflare Learning Center**. Plain language, vendor neutral explanations of networking, CDN,
  DNS, latency, and security. [cloudflare.com/learning](https://www.cloudflare.com/learning/)
- **MDN Web Docs** (CC-BY-SA, reusable with attribution). The web layer, meaning client and server
  and HTTP.
  [How the web works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works)

## By chapter and lesson

### Chapter 1: Client & Server

- **Server.** MDN
  [Client-server overview](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview),
  [What is a web server](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_web_server),
  and the [HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview).
- **Request journey.** MDN
  [How the web works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works),
  with Cloudflare [What is DNS](https://www.cloudflare.com/learning/dns/what-is-dns/) for the name
  lookup step.
- **API.** MDN
  [Introduction to web APIs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_APIs/Introduction),
  on a frontend asking a backend for data rather than a page, plus MDN
  [HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)
  and [Sending form data](https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_and_retrieving_form_data)
  for GET, POST, PUT, DELETE and the fact that HTML forms only speak GET and POST.
- **API styles (sub-section).** REST per Roy Fielding's
  [2000 dissertation](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm);
  [GraphQL](https://en.wikipedia.org/wiki/GraphQL) (Facebook, internal 2012, open-sourced 2015);
  [gRPC](https://en.wikipedia.org/wiki/GRPC) (Google, successor to Stubby, HTTP/2 plus Protocol Buffers);
  MDN [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) for the open two-way
  line that replaced polling; and
  [webhooks](https://en.wikipedia.org/wiki/Webhook) for the server calling you on an event.
- **Port.** The IANA
  [Service Name and Transport Protocol Port Number Registry](https://www.iana.org/assignments/service-names-port-numbers),
  the canonical owner of 22, 80, 443, 3389, and the rest.
- **Virtual machine.** AWS
  [What is a virtual machine](https://aws.amazon.com/what-is/virtual-machine/), which covers the
  hypervisor slicing one host into many. Compare with the VM services on each provider (EC2,
  Compute Engine, Virtual Machines).
- **Laptop as a server** and **Tunneling.** ngrok
  [documentation](https://ngrok.com/docs/getting-started) for the borrowed public door. The rest
  (a home IP that changes, uptime, slow uploads) is general networking knowledge.
- **CLI vs GUI.** The vendor docs for the real tools, meaning the shells on Linux, macOS, and
  Windows. General computing literacy, no single canonical source.

### Chapter 2: The Cloud

- **Cloud.** NIST [definition](https://csrc.nist.gov/pubs/sp/800/145/final), compared with
  AWS [What is cloud computing](https://aws.amazon.com/what-is-cloud-computing/),
  Google [What is cloud computing](https://cloud.google.com/learn/what-is-cloud-computing), and
  Microsoft [Describe cloud computing](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/).
- **Remote access.** AWS
  [Connect to a Linux instance over SSH](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-linux-inst-ssh.html)
  and Microsoft
  [Understanding Remote Desktop Protocol](https://learn.microsoft.com/en-us/troubleshoot/windows-server/remote/understanding-remote-desktop-protocol).
- **Cloud services.** The provider product catalogs, for example
  [AWS products](https://aws.amazon.com/products/).
- **Cable.** TeleGeography [Submarine Cable Map](https://www.submarinecablemap.com/), already
  attributed in the lesson.
- **Region.** AWS
  [Global Infrastructure, Regions and Availability Zones](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/)
  and Cloudflare
  [What is latency](https://www.cloudflare.com/learning/performance/glossary/what-is-latency/).

### Chapter 3: Resilience & Data

- **Availability Zone.** AWS
  [Availability Zones](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-availability-zones.html)
  and the
  [AWS fault isolation boundaries whitepaper](https://docs.aws.amazon.com/whitepapers/latest/aws-fault-isolation-boundaries/availability-zones.html).
- **Failover.** AWS Well-Architected
  [Reliability pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html).
- **Storage types.** AWS
  [Block vs file vs object storage](https://aws.amazon.com/compare/the-difference-between-block-file-object-storage/)
  and [What is object storage](https://aws.amazon.com/what-is/object-storage/).
- **Databases (SQL vs NoSQL).** AWS
  [Relational vs non-relational](https://aws.amazon.com/compare/the-difference-between-relational-and-non-relational-databases/)
  and DynamoDB
  [From SQL to NoSQL](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SQLtoNoSQL.WhyDynamoDB.html).

### Chapter 4: Data Flow (Aliran Data)

- **Ingress and egress.** Cloudflare
  [What is AWS data transfer pricing](https://www.cloudflare.com/learning/cloud/what-is-aws-data-transfer-pricing/)
  and AWS
  [Understanding data transfer charges](https://docs.aws.amazon.com/cur/latest/userguide/cur-data-transfers-charges.html).
- **Bandwidth and throughput.** TechTarget
  [Network bandwidth vs throughput](https://www.techtarget.com/searchnetworking/feature/Network-bandwidth-vs-throughput-Whats-the-difference)
  (the same pipe and water idea the lesson uses), with Cloudflare
  [How CDNs reduce bandwidth cost](https://www.cloudflare.com/learning/cdn/how-cdns-reduce-bandwidth-cost/)
  on bandwidth as data transfer.
- **Bottleneck.** AWS Well-Architected
  [Performance Efficiency pillar](https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/welcome.html).

### Chapter 5: Traffic

- **Reverse proxy.** Cloudflare
  [What is a reverse proxy](https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/).
- **Load balancer.** Cloudflare
  [What is load balancing](https://www.cloudflare.com/learning/performance/what-is-load-balancing/),
  which also covers skipping a failed server.
- **Scaling** and **Auto scaling.** AWS Well-Architected
  [Performance Efficiency pillar](https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/welcome.html),
  compared with each provider's auto scaling docs.
- **Caching and CDN.** Cloudflare
  [What is a CDN](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/).

### Chapter 6: Networking & Security

- **IP and DNS.** Cloudflare
  [What is the Internet Protocol](https://www.cloudflare.com/learning/network-layer/internet-protocol/)
  for IP, and [What is DNS](https://www.cloudflare.com/learning/dns/what-is-dns/) for the name to
  address lookup.
- **Layers and packets.** Cloudflare
  [What is the OSI model](https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/)
  for the layered stack,
  [What is TCP/IP](https://www.cloudflare.com/learning/ddos/glossary/tcp-ip/) for reliable delivery,
  and [What is UDP](https://www.cloudflare.com/learning/ddos/glossary/user-datagram-protocol-udp/)
  for the fast, lossy alternative.
- **Private networks and subnets.** AWS
  [What is Amazon VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html),
  which defines subnets and public versus private.
- **Firewalls.** Cloudflare
  [What is a firewall](https://www.cloudflare.com/learning/security/what-is-a-firewall/).
- **Identity and Access.** AWS
  [What is IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html).
- **Encryption.** Cloudflare
  [What is SSL](https://www.cloudflare.com/learning/ssl/what-is-ssl/) and
  [Transport Layer Security (TLS)](https://www.cloudflare.com/learning/ssl/transport-layer-security-tls/).
- **Shared responsibility.** AWS
  [Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/) and
  the Well-Architected
  [Security pillar version](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/shared-responsibility.html).

### Chapter 7: Compute & Operations

- **Containers.** Docker
  [What is a container](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/),
  Kubernetes [Concepts](https://kubernetes.io/docs/concepts/), and the
  [CNCF](https://www.cncf.io/).
- **Microservices.** AWS
  [Monolithic vs microservices architecture](https://aws.amazon.com/compare/the-difference-between-monolithic-and-microservices-architecture/),
  on splitting one app into small services that each do one job and talk over APIs.
- **Serverless.** AWS [What is Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
  and the [product page](https://aws.amazon.com/lambda/).
- **Monitoring.** AWS Well-Architected
  [Operational Excellence pillar](https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/welcome.html).
- **Cost.** AWS Well-Architected
  [six pillars](https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html)
  (Cost Optimization), compared with each provider's pricing and cost tools.
- **CI/CD.** GitLab
  [CI/CD concepts](https://docs.gitlab.com/ee/ci/introduction/), a vendor neutral explanation of
  building, testing, and deploying every change automatically.

## Licensing and responsible use

- **NIST** publications are public domain.
- **MDN Web Docs** is CC-BY-SA, so it can be reused with attribution.
- **Provider docs** (AWS, Google, Microsoft) and the **Cloudflare Learning Center** are copyrighted.
  Read them, then write the lesson in Nim's own words and cite the source. Do not copy text or
  images.
- **TeleGeography** cable data is shown with attribution in the Cable lesson.
- **Provider logos** are trademarks of their owners and appear only to identify each provider.

## Interactive learning audit, November 2026

Coverage was checked against the primary roadmap diagrams for
[Cyber Security](https://roadmap.sh/pdfs/roadmaps/cyber-security.pdf),
[Frontend](https://roadmap.sh/pdfs/roadmaps/frontend.pdf),
[DevOps](https://roadmap.sh/pdfs/roadmaps/devops.pdf), and
[AI Engineer](https://roadmap.sh/pdfs/roadmaps/ai-engineer.pdf).
The lesson sequence remains a Nimbus beginner sequence rather than a copy of the diagrams.

- **Data centers.** AWS [What is a data center](https://aws.amazon.com/what-is/data-center/), for physical facilities, racks, power, cooling, and networking. Timing and heat in the lesson are explicitly simplified teaching values.
- **Burp Suite.** PortSwigger [Working with HTTP messages in Repeater](https://portswigger.net/burp/documentation/desktop/tools/repeater/http-messages). The lesson reproduces capture, forward, edit, resend, and comparison locally.
- **Object authorization.** OWASP [IDOR Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html), for server permission checks on each requested object.
- **Forms.** MDN [Client side form validation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation), including why server validation remains necessary.
- **HTTP.** MDN [Response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status) and [Evolution of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Evolution_of_HTTP), for status families and HTTP/3 transport. The text avoids blaming the learner for a 4xx response.
- **Passwords.** OWASP [Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), for salts, costly password algorithms, and why a fast general purpose hash is only a demonstration.
- **SSO.** OpenID Foundation [How OpenID Connect works](https://openid.net/developers/how-connect-works/), for the distinction between authentication and OAuth delegated authorization.
- **Execution errors.** Python [Errors and Exceptions](https://docs.python.org/3/tutorial/errors.html), for syntax errors versus exceptions at execution time. The compiler experiment is labeled as two simplified execution strategies, not a universal timing rule.

Private WiFi addresses and local neighbor discovery

- [Apple, private WiFi addresses](https://support.apple.com/en-us/102509)
- [IETF, ARP specification](https://www.rfc-editor.org/rfc/rfc826.html)

### Security foundations and terminology, November 2026

- **OWASP.** [About OWASP](https://owasp.org/about), [Top 10 2025](https://top10.owasp.org/2025/), [ASVS](https://asvs.owasp.org/), and [WSTG](https://owasp.org/projects/web-security-testing-guide). The lesson uses the 2025 category order and distinguishes awareness, verification requirements, and testing guidance.
- **NIST.** [CSF 2.0](https://www.nist.gov/cyberframework) and [CSF FAQs](https://www.nist.gov/cyberframework/faqs). Govern, Identify, Protect, Detect, Respond, and Recover are concurrent functions, not a one time linear checklist. The exercise illustrates one incident inside that ongoing work.
- **CVE and CWE.** MITRE [CWE FAQ](https://cwe.mitre.org/about/faq.html). The advisory in Nimbus is fictional and is explicitly not an assigned CVE.
- **CVSS.** FIRST [v2 guide](https://www.first.org/cvss/v2/guide), [3.0 specification](https://www.first.org/cvss/v3.0/specification-document), [3.1 specification](https://www.first.org/cvss/v3.1/specification-document), [3.1 examples](https://www.first.org/cvss/v3.1/examples), [4.0 specification](https://www.first.org/cvss/v4.0/specification-document), and [4.0 examples](https://www.first.org/cvss/v4.0/examples). Three hypothetical cases are assessed independently under each version after the learner tests their impacts and access requirements. This is not an automatic vector conversion. The v2 and v3 Base equations follow FIRST; the v4 engine is the pinned BSD licensed Red Hat implementation documented in `src/lib/components/labs/vendor/README.md`. Tests include published score fixtures. [NVD severity bands](https://nvd.nist.gov/vuln-metrics/cvss) distinguish the v2 High maximum label from v3 and v4 Critical. Additional score groups are explained but not calculated.
- **Prioritization.** FIRST [EPSS](https://www.first.org/epss/) and CISA's [KEV explanation](https://content.govdelivery.com/accounts/USDHSCISA/bulletins/42a9f71). EPSS forecasts exploitation of a published CVE in the wild over the next 30 days. KEV indicates evidence of exploitation. Exercise percentages are fictional, not live threat intelligence.
- **CSRF and SSRF.** OWASP [CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) and [SSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html). The exercises model cookie behavior, tokens, destination restrictions, and redirect checks locally.
- **Threat modeling.** Microsoft [STRIDE threat categories](https://learn.microsoft.com/en-us/windows-hardware/drivers/driversecurity/threat-modeling-for-drivers).
- **Ransomware recovery.** [CISA ransomware guide](https://www.cisa.gov/sites/default/files/publications/CISA_MS-ISAC_Ransomware%20Guide_S508C_.pdf) and [FBI cyber resiliency guidance](https://www.fbi.gov/investigate/cyber/ten-actions-to-improve-cyber-resiliency). Offline or immutable protection complements separate backup copies and restore testing.
- **Serverless limits.** AWS [provisioned concurrency](https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html) and [Lambda pricing](https://aws.amazon.com/lambda/pricing/). An idle function is not a universal promise of a zero bill.
