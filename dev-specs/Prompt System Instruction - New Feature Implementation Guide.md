

When implementing new features or modifying existing components in the Gestalt Language Coach application, follow these systematic instructions:

## 1. FEATURE ANALYSIS REQUIREMENTS

BEFORE IMPLEMENTATION, analyze and document:

```typescript
// Required Analysis Structure
{
  "featureName": string,
  "integrationType": "standalone" | "integration" | "enhancement",
  "affectedSystems": {
    "components": string[],    // List affected components
    "routes": string[],        // List affected routes
    "services": string[],      // List required services
    "database": string[]       // List affected collections
  },
  "securityScope": {
    "authentication": boolean,
    "roles": string[],
    "permissions": string[]
  }
}
```

## 2. IMPLEMENTATION RULES

### Route Implementation
WHEN CREATING NEW ROUTES:
- Place in appropriate route group in `app/` directory
- Follow existing route group structure:
  ```
  app/
  ├── (public)/     // Public routes
  ├── (auth)/       // Authenticated routes
  ├── (specialist)/ // Specialist routes
  └── (admin)/      // Admin routes
  ```

### Component Modifications
WHEN MODIFYING EXISTING COMPONENTS:
1. Extend existing interfaces
2. Maintain current prop patterns
3. Add feature flags when appropriate
4. Preserve existing functionality

Example pattern:
```typescript
// FOLLOW THIS PATTERN:
interface ExistingComponentProps {
  // Existing props remain unchanged
  existingProp: ExistingType;
  
  // Add new props with optional flags
  newFeature?: boolean;
  newFeatureData?: NewFeatureType;
}
```

### Data Structure Changes
WHEN MODIFYING DATABASE:
1. Add to existing collections when possible
2. Create new collections only when necessary
3. Update security rules
4. Maintain existing indexes

Pattern:
```typescript
// FOLLOW THIS PATTERN FOR COLLECTION UPDATES:
interface CollectionUpdate {
  existingFields: maintain;    // Never modify existing
  newFields: {                 // Add new fields as optional
    newField?: NewType;
    newFeatureFlag?: boolean;
  }
}
```

## 3. INTEGRATION REQUIREMENTS

### State Management
MUST FOLLOW these patterns:
```typescript
// Local State Pattern
function Component() {
  // 1. Define state at top of component
  const [state, setState] = useState<StateType>();
  
  // 2. Use callbacks for updates
  const updateState = useCallback(() => {
    setState(prev => ({ ...prev, update }));
  }, [dependencies]);
}

// Global State Pattern
const useFeatureStore = create<FeatureState>((set) => ({
  // 1. Define initial state
  state: initialState,
  
  // 2. Define actions
  actions: {
    updateState: (newState) => set(state => ({
      ...state,
      ...newState
    }))
  }
}));
```

### API Integration
MUST IMPLEMENT with this structure:
```typescript
// API Route Pattern
export default async function handler(req, res) {
  try {
    // 1. Validate authentication
    const user = await validateAuth(req);
    
    // 2. Validate permissions
    await validatePermissions(user, requiredPermissions);
    
    // 3. Process request
    const result = await processRequest(req.body);
    
    // 4. Return response
    return res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
}
```

## 4. SECURITY REQUIREMENTS

MUST IMPLEMENT these security patterns:

### Firebase Rules
```javascript
// REQUIRED RULE PATTERN
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 1. User Authentication Check
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // 2. Role Validation
    function hasRole(role) {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
    
    // 3. Feature Access Check
    function hasFeatureAccess(feature) {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.features[feature] == true;
    }
    
    // 4. Apply Rules
    match /{document=**} {
      allow read: if isAuthenticated() && hasFeatureAccess('featureName');
      allow write: if hasRole('requiredRole') && hasFeatureAccess('featureName');
    }
  }
}
```

## 5. TESTING REQUIREMENTS

MUST INCLUDE these test patterns:

```typescript
// REQUIRED TEST STRUCTURE
describe('Feature', () => {
  // 1. Component Tests
  describe('Components', () => {
    it('renders correctly', () => {
      // Test component rendering
    });
    
    it('handles user interactions', () => {
      // Test user interactions
    });
  });
  
  // 2. Integration Tests
  describe('Integration', () => {
    it('integrates with existing features', () => {
      // Test feature integration
    });
  });
  
  // 3. API Tests
  describe('API', () => {
    it('handles requests correctly', () => {
      // Test API endpoints
    });
  });
});
```

## 6. DOCUMENTATION REQUIREMENTS

MUST INCLUDE for all new features:

```typescript
/**
 * @feature FeatureName
 * @description Comprehensive description of feature
 * 
 * @integration
 * - List integrated components
 * - List affected routes
 * - List required services
 * 
 * @security
 * - Required roles
 * - Required permissions
 * 
 * @usage
 * ```tsx
 * // Usage example
 * ```
 */
```

## 7. PERFORMANCE REQUIREMENTS

MUST IMPLEMENT these optimizations:

```typescript
// REQUIRED OPTIMIZATION PATTERNS
{
  // 1. Component Optimization
  memoization: {
    components: React.memo,    // For expensive renders
    calculations: useMemo,     // For expensive computations
    callbacks: useCallback     // For function props
  },
  
  // 2. Data Loading
  dataFetching: {
    pagination: true,          // For large lists
    caching: true,            // For repeated data
    prefetching: true         // For predictable navigation
  },
  
  // 3. Asset Optimization
  assets: {
    lazyLoading: true,        // For images and large components
    codeSpitting: true,       // For large feature sets
    bundleSize: 'monitored'   // For performance tracking
  }
}
```

## 8. ERROR HANDLING REQUIREMENTS

MUST IMPLEMENT this error handling pattern:

```typescript
// REQUIRED ERROR HANDLING PATTERN
try {
  // Feature operation
} catch (error) {
  // 1. Log error
  console.error('[FeatureName]:', error);
  
  // 2. Categorize error
  const errorType = categorizeError(error);
  
  // 3. Handle based on type
  switch (errorType) {
    case 'auth':
      handleAuthError(error);
      break;
    case 'permission':
      handlePermissionError(error);
      break;
    default:
      handleGenericError(error);
  }
  
  // 4. Report if necessary
  reportError(error);
}
```

END SYSTEM INSTRUCTIONS.

