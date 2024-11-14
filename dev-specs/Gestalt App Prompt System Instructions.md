
## Project Overview
This document serves as the system instruction set for developing the Gestalt Language Coach application, a platform designed to support parents and caregivers in children's language development using GLP approaches.

# Gestalt Language Coach

## Project Overview

Gestalt Language Coach is a comprehensive platform supporting parents and caregivers in their children's language development, specifically focusing on Gestalt Language Processing (GLP). The platform bridges the gap between professional speech therapy sessions by providing continuous support, resources, and guidance.

### Key Features
- AI-powered coaching with voice and text interaction
- Progress tracking and milestone management
- Specialist integration and appointment scheduling
- Resource library and community support
- Multi-platform support (Web and iOS)

## Technical Architecture

### Technology Stack
- **Frontend**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Language**: TypeScript
- **Backend**: Firebase (Authentication, Firestore, Storage, Functions)
- **Deployment**: Vercel (Web), App Store (iOS)

## Design System

### UI Components
All components should use shadcn/ui with consistent styling:

```typescript
colors: {
  primary: 'slate',
  accent: 'blue',
  background: 'white',
  text: 'slate-900'
}

spacing: {
  layout: '1.5rem',
  components: '1rem',
  content: '0.75rem'
}

breakpoints: {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px'
}
```

## Core Features

### AI Coach
- Voice-to-voice communication
- Text chat interface
- Context-aware responses
- Progress integration
- Specialist guidance incorporation

### Progress Tracking
- Milestone tracking
- Development stage monitoring
- Custom goals
- Analytics and reporting
- Visual progress representation

### Specialist Integration
- Appointment scheduling
- Session management
- Resource sharing
- Progress documentation
- Communication tools

### Community Features
- Discussion forums
- Support groups
- Resource sharing
- Experience exchange
- Expert contributions

## Data Models

### User Types
```typescript
interface User {
  id: string;
  email: string;
  role: 'admin' | 'specialist' | 'parent' | 'caregiver';
  profile: UserProfile;
  settings: UserSettings;
  subscription: SubscriptionDetails;
}

interface ChildProfile {
  id: string;
  name: string;
  dateOfBirth: Date;
  parentIds: string[];
  specialists: SpecialistAssignment[];
  development: DevelopmentTracking;
  sessions: SessionRecord[];
}
```

## Authentication & Access Control

### Role-Based Access
- **Admin**: Full system access
- **Specialist**: Client management, session tools
- **Parent**: Child management, progress tracking
- **Caregiver**: Limited child access, progress viewing

### Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || isAdmin();
    }

    match /children/{childId} {
      allow read: if canAccessChild(childId);
      allow write: if isChildParent(childId) || isAdmin();
    }
  }
}
```

## Development Guidelines

### Code Standards
1. Use TypeScript with strict mode enabled
2. Follow component-based architecture
3. Implement responsive design (mobile-first)
4. Ensure accessibility compliance (WCAG 2.1)
5. Optimize for performance
6. Write comprehensive tests
7. Document all features

### Performance Requirements
- Initial load: < 2s
- Page transitions: < 300ms
- Interaction response: < 100ms
- Optimize and lazy load images
- Implement code splitting
- Use appropriate caching strategies

## Firebase Integration

### Services
- Authentication (email, Google, Apple)
- Firestore for data storage
- Cloud Storage for media
- Cloud Functions for backend logic
- Hosting for web deployment

### Security
- Implement proper security rules
- Use appropriate data access patterns
- Follow Firebase best practices
- Regular security audits

## iOS Application

### Platform Integration
- Shared Firebase backend
- Consistent design language
- Feature parity with web
- Native iOS capabilities
- Push notifications

## Documentation Requirements

### Technical Documentation
- API documentation
- Component documentation
- Firebase configuration
- Deployment procedures

### User Documentation
- Feature guides
- API integration guides
- Security documentation
- Maintenance guides

## Version Control

### Branch Strategy
- main: production code
- develop: development code
- feature/*: feature branches
- hotfix/*: urgent fixes

### Release Process
- Semantic versioning
- Changelog maintenance
- Release notes
- Migration guides

## Technical Stack

### Core Technologies
```typescript
interface TechnicalStack {
  frontend: {
    framework: 'Next.js 13+';
    styling: {
      primary: 'Tailwind CSS';
      components: 'shadcn/ui';
      customization: true;
    };
    language: 'TypeScript';
    routing: 'App Router';
  };

  backend: {
    primary: 'Firebase';
    services: [
      'Authentication',
      'Firestore',
      'Storage',
      'Functions',
      'Hosting'
    ];
  };

  deployment: {
    web: 'Vercel';
    mobile: 'iOS App Store';
  };
}
```

## Application Structure

### Directory Organization
```typescript
src/
├── app/                         # Next.js 13+ app directory
│   ├── public/               # Public routes
│   │   ├── page.tsx            # Landing page
│   │   ├── about/
│   │   ├── pricing/
│   │   ├── blog/
│   │   ├── resources/          # Public resources
│   │   ├── login/
│   │   ├── register/
│   │   │   ├── page.tsx
│   │   │   ├── plan-selection/
│   │   │   └── payment/
│   │   └── layout.tsx
│   │
│   ├── auth/                # Protected routes
│   │   ├── dashboard/         # User dashboard
│   │   │   ├── page.tsx
│   │   │   ├── overview/
│   │   │   ├── calendar/      # Global calendar
│   │   │   └── notifications/ # Notification center
│   │   │
│   │   ├── profile/          # User profile management
│   │   │   ├── settings/
│   │   │   ├── subscription/
│   │   │   └── preferences/
│   │   │
│   │   ├── children/         # Child management
│   │   │   ├── [childId]/
│   │   │   │   ├── overview/
│   │   │   │   ├── progress/
│   │   │   │   ├── journal/
│   │   │   │   ├── specialists/
│   │   │   │   └── settings/
│   │   │   └── new/
│   │   │
│   │   ├── ai-coach/         # AI coaching interface
│   │   │   ├── chat/
│   │   │   ├── analysis/
│   │   │   └── history/
│   │   │
│   │   ├── sessions/         # Session management
│   │   │   ├── schedule/
│   │   │   ├── history/
│   │   │   └── [sessionId]/
│   │   │
│   │   ├── messages/         # Messaging center
│   │   │   ├── inbox/
│   │   │   ├── threads/
│   │   │   └── [threadId]/
│   │   │
│   │   ├── journal/          # Journaling system
│   │   │   ├── entries/
│   │   │   ├── templates/
│   │   │   └── [entryId]/
│   │   │
│   │   ├── community/        # Community features
│   │   │   ├── forums/
│   │   │   ├── groups/
│   │   │   └── resources/
│   │   │
│   │   └── resources/        # Resource library
│   │       ├── browse/
│   │       ├── favorites/
│   │       └── recommended/
│   │
│   ├── (specialist)/         # Specialist portal
│   │   ├── dashboard/
│   │   ├── clients/
│   │   │   ├── overview/
│   │   │   └── [clientId]/
│   │   ├── schedule/
│   │   ├── resources/
│   │   └── billing/
│   │
│   └── (admin)/             # Admin portal
│       ├── dashboard/
│       ├── users/
│       ├── content/
│       └── settings/
│
├── components/
│   ├── ui/                  # Base UI components
│   │   └── [shadcn-ui components]
│   │
│   ├── layout/             # Layout components
│   │   ├── headers/
│   │   ├── navigation/
│   │   └── footer/
│   │
│   ├── features/           # Feature components
│   │   ├── ai-coach/
│   │   │   ├── chat-interface.tsx
│   │   │   ├── voice-recorder.tsx
│   │   │   └── analysis-display.tsx
│   │   │
│   │   ├── calendar/
│   │   │   ├── calendar-view.tsx
│   │   │   ├── event-creator.tsx
│   │   │   └── scheduler.tsx
│   │   │
│   │   ├── messaging/
│   │   │   ├── chat-thread.tsx
│   │   │   ├── message-composer.tsx
│   │   │   └── notification-handler.tsx
│   │   │
│   │   ├── journal/
│   │   │   ├── entry-editor.tsx
│   │   │   ├── media-uploader.tsx
│   │   │   └── entry-viewer.tsx
│   │   │
│   │   └── progress/
│   │       ├── tracker.tsx
│   │       ├── milestone-cards.tsx
│   │       └── analysis-charts.tsx
│   │
│   └── shared/            # Shared components
│       ├── notifications/
│       ├── media/
│       └── forms/
│
├── assets/               # Assets
│   ├── images/           # All images, icons, and other assets
│   ├── videos/           # All videos
│   └── audios/           # All audios
│   └── documents/        # All documents and pdfs
│
├── lib/                   # Core utilities
│   ├── firebase/         # Firebase configuration
│   │   ├── config.ts
│   │   ├── admin.ts
│   │   └── storage.ts
│   │
│   ├── api/             # API integrations
│   │   ├── claude/      # Claude AI integration
│   │   ├── speech/      # Speech processing
│   │   └── calendar/    # Calendar integration
│   │
│   └── utils/          # Utility functions
│
├── hooks/              # Custom React hooks
│   ├── use-auth.ts
│   ├── use-ai-coach.ts
│   ├── use-calendar.ts
│   ├── use-notifications.ts
│   └── use-realtime.ts
│
├── contexts/          # React contexts
│   ├── auth-context.tsx
│   ├── ai-context.tsx
│   ├── calendar-context.tsx
│   └── notification-context.tsx
│
├── types/             # TypeScript types
│   ├── auth.ts
│   ├── ai.ts
│   ├── calendar.ts
│   └── notifications.ts
│
└── services/         # Service layer
    ├── firebase/
    ├── ai/
    ├── calendar/
    └── notifications/
```

## Design Requirements

### UI Components
All components should use shadcn/ui with consistent styling:

```typescript
interface DesignSystem {
  colors: {
    primary: 'slate';
    accent: 'blue';
    background: 'white';
    text: 'slate-900';
  };

  spacing: {
    layout: '1.5rem';
    components: '1rem';
    content: '0.75rem';
  };

  breakpoints: {
    mobile: '640px';
    tablet: '768px';
    desktop: '1024px';
    wide: '1280px';
  };
}
```

### Responsive Design
```typescript
interface ResponsiveRequirements {
  approach: 'mobile-first';
  layouts: {
    mobile: 'stacked';
    tablet: 'hybrid';
    desktop: 'sidebar';
  };
  navigation: {
    mobile: 'bottom-sheet';
    tablet: 'collapsible';
    desktop: 'sidebar';
  };
}
```

## Feature Requirements

### AI Coach
```typescript
interface AICoach {
  interfaces: {
    voice: {
      input: boolean;
      output: boolean;
      realtime: boolean;
    };
    text: {
      chat: boolean;
      suggestions: boolean;
    };
  };
  
  features: {
    contextAwareness: boolean;
    progressTracking: boolean;
    specialistIntegration: boolean;
  };
}
```

### Calendar & Scheduling
```typescript
interface CalendarSystem {
  views: {
    daily: boolean;
    weekly: boolean;
    monthly: boolean;
    agenda: boolean;
  };
  
  features: {
    appointments: boolean;
    reminders: boolean;
    recurring: boolean;
    notifications: boolean;
  };
  
  integration: {
    specialists: boolean;
    progress: boolean;
    notifications: boolean;
  };
}
```

### Progress Tracking
```typescript
interface ProgressTracking {
  metrics: {
    milestones: boolean;
    activities: boolean;
    sessions: boolean;
  };
  
  visualization: {
    charts: boolean;
    timelines: boolean;
    comparisons: boolean;
  };
  
  reporting: {
    automated: boolean;
    customizable: boolean;
    shareable: boolean;
  };
}
```

## Data Models

### Core Data Structures
```typescript
interface DataModels {
  user: {
    profile: UserProfile;
    settings: UserSettings;
    subscription: SubscriptionDetails;
  };

  child: {
    profile: ChildProfile;
    development: DevelopmentTracking;
    sessions: SessionRecord[];
  };

  specialist: {
    profile: SpecialistProfile;
    clients: ClientRecord[];
    schedule: Availability;
  };
}
```

## Authentication & Authorization

### Access Control
```typescript
interface AccessControl {
  roles: {
    admin: AdminPermissions;
    specialist: SpecialistPermissions;
    parent: ParentPermissions;
    caregiver: CaregiverPermissions;
  };

  features: {
    public: string[];
    protected: string[];
    roleSpecific: Record<string, string[]>;
  };

  sessions: {
    duration: number;
    refresh: boolean;
    multiFactor: boolean;
  };
}
```

## Performance Requirements

### Optimization Targets
```typescript
interface PerformanceTargets {
  loading: {
    initialLoad: '< 2s';
    pageTransition: '< 300ms';
    interaction: '< 100ms';
  };

  optimization: {
    images: boolean;
    fonts: boolean;
    codeSpitting: boolean;
    lazyLoading: boolean;
  };

  caching: {
    static: boolean;
    dynamic: boolean;
    api: boolean;
  };
}
```

## Development Guidelines

### Code Standards
```typescript
interface CodeStandards {
  typescript: {
    strict: true;
    typeChecking: 'comprehensive';
  };

  components: {
    naming: 'PascalCase';
    organization: 'feature-based';
    documentation: 'required';
  };

  testing: {
    unit: boolean;
    integration: boolean;
    e2e: boolean;
  };
}
```

### Implementation Notes
1. All components should be fully typed with TypeScript
2. Use shadcn/ui components as building blocks
3. Implement responsive design from mobile-first
4. Ensure accessibility compliance
5. Follow performance optimization guidelines
6. Maintain consistent error handling
7. Implement comprehensive logging
8. Follow security best practices

## Firebase Integration

### Service Usage
```typescript
interface FirebaseServices {
  authentication: {
    methods: ['email', 'google', 'apple'];
    security: 'high';
  };

  database: {
    type: 'firestore';
    collections: Collection[];
    rules: SecurityRules;
  };

  storage: {
    buckets: Bucket[];
    access: StorageRules;
  };

  functions: {
    triggers: Trigger[];
    scheduling: Schedule[];
  };
}
```

