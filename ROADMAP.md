# 🗺️ Weblog.social Roadmap

## Vision
Transform weblog.social from a simple MetaWeblog-to-Bluesky bridge into a comprehensive decentralized blogging platform powered by AT Protocol, enabling users to create, discover, and follow long-form content across the decentralized web.

---

## 🎯 Current Status (v1.0)

### ✅ Completed Features
- **MetaWeblog Bridge**: XML-RPC compatibility with blog editors (MarsEdit, Open Live Writer, etc.)
- **Bluesky Integration**: Direct publishing to Bluesky with AT Protocol
- **Multiple Lexicons**: Support for standard Bluesky posts and Whitewind blog entries
- **Custom Field System**: `lexicon` parameter for format selection
- **Post Retrieval**: Multi-collection support for reading posts back
- **Production Deployment**: SSL-enabled service at https://weblog.social

---

## 🚀 Phase 2: Extended Lexicon Support

### Long-form Content Lexicons
- [ ] **Blog Lexicon** (`com.weblog.social.blog`)
  - Custom blog/publication records separate from Whitewind
  - Support for blog metadata (name, description, theme)
  - Multi-blog support per user
  - Blog-specific settings and customization

- [ ] **Publication Lexicon** (`com.weblog.social.publication`)
  - Organizational structure for grouping related blogs
  - Publication-level metadata and branding
  - Contributor management for collaborative blogs

### Discovery & Social Features
- [ ] **Blogroll Lexicon** (`com.weblog.social.blogroll`)
  - Follow mechanism for long-form content creators
  - AT Protocol native following for blogs/publications
  - Subscription management and notifications

### Media & Content Features
- [ ] **Media Upload Support** ⭐ **Priority**
  - MetaWeblog API media upload endpoints (`metaWeblog.newMediaObject`)
  - Support for images, videos, and document attachments
  - Automatic image resizing and optimization
  - CDN integration for fast media delivery
  - Media library management and organization

---

## 🏗️ Phase 3: Web Platform Development

### User Experience
- [ ] **User Profile Pages** (`/user/{handle}`)
  - Display user's blogs and publications
  - Blog discovery and browsing
  - Author biography and social links
  - Statistics (posts, followers, etc.)

- [ ] **Individual Blog Pages** (`/blog/{handle}/{blog-id}`)
  - Blog description and metadata
  - Recent posts feed (last N posts)
  - Blog-specific RSS feed
  - Archive and category browsing

- [ ] **Reader Interface** (`/reader`)
  - Personalized feed based on blogroll follows
  - Recent posts from followed blogs
  - Reading history and bookmarks
  - Post interaction (likes, shares, comments)

### Custom Domains & Federation
- [ ] **Custom Domain Support**
  - CNAME subdomain pointing (e.g., `blog.yoursite.com` → `yourhandle.weblog.social`)
  - SSL certificate automation for custom domains
  - Domain verification and management
  - Custom branding and theming per domain

- [ ] **ActivityPub Integration**
  - ActivityPub endpoints for custom domains
  - Federation with Mastodon, Pleroma, and other ActivityPub networks
  - Cross-platform mentions and interactions
  - Followers/following synchronization between protocols

### Feed & Syndication
- [ ] **RSS Feeds**
  - Individual blog RSS feeds
  - User's combined blog RSS
  - Reader's following feed as RSS
  - Custom feed filtering and categories

- [ ] **OPML Support**
  - Export user's blogroll as OPML
  - Import OPML to follow multiple blogs
  - OPML-based blog discovery
  - Integration with existing RSS readers

---

## 🔧 Phase 4: Advanced Features

### Content Management
- [ ] **Rich Editor Integration**
  - Web-based Markdown editor
  - Live preview and formatting tools
  - Image upload and media management
  - Draft saving and scheduled publishing

### Analytics & Insights
- [ ] **Blog Analytics**
  - Post view counts and engagement
  - Follower growth tracking
  - Content performance insights
  - Export capabilities for external analysis

### Community Features
- [ ] **Comments & Interactions**
  - AT Protocol native commenting system
  - Cross-blog conversations and mentions
  - Moderation tools and spam protection
  - Comment threading and notifications

---

## 🌐 Phase 5: Ecosystem Integration

### Developer Platform
- [ ] **API Documentation**
  - REST API for blog management
  - Webhook system for integrations
  - Third-party app authentication
  - Rate limiting and usage analytics

### Federation & Discovery
- [ ] **Cross-Platform Integration**
  - ActivityPub bridge for Mastodon/Fediverse
  - RSS aggregation from external sources
  - Blog migration tools (WordPress, Ghost, etc.)
  - SEO optimization and search indexing

---

## 🎨 Technical Architecture

### Backend Enhancements
- [ ] **Database Layer**
  - Caching for frequently accessed content
  - Full-text search capabilities
  - Analytics data storage
  - User preference management

### Frontend Development
- [ ] **Modern Web Framework**
  - React/Next.js or similar SPA framework
  - Progressive Web App (PWA) capabilities
  - Mobile-responsive design
  - Accessibility compliance (WCAG 2.1)

### Infrastructure
- [ ] **Scalability Improvements**
  - CDN integration for static assets
  - Database optimization and indexing
  - Horizontal scaling capabilities
  - Monitoring and alerting systems

---

## 📊 Success Metrics

### Adoption Goals
- **Q4 2025**: 1,000+ active blogs
- **Q2 2026**: 10,000+ blog posts published
- **Q4 2026**: 100,000+ monthly page views

### Feature Completion
- **Phase 2**: Extended lexicons (Q4 2025)
- **Phase 3**: Web platform (Q2 2026)
- **Phase 4**: Advanced features (Q4 2026)
- **Phase 5**: Full ecosystem (Q2 2027)

---

## 🤝 Contributing

### Development Priorities
1. **Media Upload Support**: MetaWeblog API compatibility with image/media handling ⭐
2. **Lexicon Development**: Design and implement new AT Protocol lexicons
3. **Custom Domain Infrastructure**: CNAME support and SSL automation
4. **ActivityPub Integration**: Federation with existing decentralized networks
5. **Web Interface**: Create intuitive user interfaces for content discovery
6. **API Design**: Build robust APIs for third-party integrations
7. **Documentation**: Comprehensive guides for users and developers

### Community Building
- Developer documentation and tutorials
- User onboarding and support resources
- Blog editor integrations and plugins
- Partnership with existing blogging platforms

---

## 📝 Implementation Notes

### Technical Considerations
- **AT Protocol Compliance**: Ensure all lexicons follow AT Protocol standards
- **MetaWeblog API Compatibility**: Full support including media upload endpoints
- **Custom Domain Infrastructure**: DNS management, SSL automation, subdomain routing
- **Media Storage & CDN**: Scalable image/video hosting with optimization
- **ActivityPub Federation**: Protocol bridge implementation for cross-network compatibility
- **Performance**: Optimize for fast loading and responsive user experience
- **Security**: Implement proper authentication, authorization, and data protection

### User Experience Priorities
- **Simplicity**: Keep the barrier to entry low for new users
- **Familiarity**: Maintain compatibility with existing blog editor workflows
- **Discovery**: Make it easy to find and follow interesting long-form content
- **Ownership**: Users retain full control of their content via AT Protocol

---

*This roadmap is a living document that will evolve based on user feedback, technical constraints, and community needs. Last updated: August 9, 2025*
