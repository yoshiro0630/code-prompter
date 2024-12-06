import { ProjectType } from '../../types/prompt-types';

export interface StagePrompt {
  title: string;
  objective: string;
  prompt: string;
  outcome: string;
}

export const getStagePrompts = (stage: number, projectType: ProjectType = 'website'): StagePrompt[] => {
  const prompts: Record<number, StagePrompt[]> = {
    1: [ // Core Features
      {
        title: 'User Authentication System',
        objective: 'Create a secure authentication system with login, registration, and password recovery',
        prompt: `Implement a complete authentication system with the following specifications:
1. Create user registration with email verification
2. Implement secure login with JWT tokens
3. Add password reset functionality
4. Set up protected route middleware
5. Include social authentication options`,
        outcome: 'A fully functional authentication system with secure user management'
      },
      {
        title: 'User Profile Management',
        objective: 'Develop user profile functionality with data management and preferences',
        prompt: `Build a user profile system that includes:
1. Profile data CRUD operations
2. Avatar upload and management
3. User preferences storage
4. Activity history tracking
5. Profile privacy settings`,
        outcome: 'Complete user profile management system with data persistence'
      },
      {
        title: 'Dashboard Interface',
        objective: 'Create a responsive dashboard with key user information and actions',
        prompt: `Design and implement a dashboard that features:
1. User activity summary components
2. Data visualization widgets
3. Quick action buttons
4. Notification center
5. Customizable layout options`,
        outcome: 'Interactive dashboard interface with real-time updates'
      },
      {
        title: 'Search and Filter System',
        objective: 'Implement advanced search functionality with filters and sorting',
        prompt: `Create a search system with:
1. Full-text search implementation
2. Multiple filter criteria
3. Dynamic sorting options
4. Search history tracking
5. Results pagination`,
        outcome: 'Efficient search system with advanced filtering capabilities'
      },
      {
        title: 'Data Export/Import',
        objective: 'Build data import/export functionality with multiple format support',
        prompt: `Implement data transfer features including:
1. CSV/Excel export functionality
2. JSON data import/export
3. Bulk data operations
4. Progress tracking
5. Error handling and validation`,
        outcome: 'Robust data import/export system with format validation'
      }
    ],
    2: [ // User Interface
      {
        title: 'Responsive Layout System',
        objective: 'Create a flexible layout system that works across all devices',
        prompt: `Implement a responsive layout system with:
1. Grid-based component structure
2. Flexbox container management
3. Breakpoint-specific styling
4. Dynamic sidebar/navigation
5. Mobile-first approach`,
        outcome: 'Fully responsive layout system with consistent behavior'
      },
      {
        title: 'Form Components',
        objective: 'Build reusable form components with validation and error handling',
        prompt: `Create a form system including:
1. Input validation patterns
2. Error message handling
3. Dynamic field generation
4. Form state management
5. Submit handling with loading states`,
        outcome: 'Complete form component library with validation'
      },
      {
        title: 'Data Tables',
        objective: 'Implement interactive data tables with sorting and filtering',
        prompt: `Build data table components with:
1. Column sorting functionality
2. Filter implementation
3. Row selection features
4. Pagination controls
5. Custom column rendering`,
        outcome: 'Interactive data tables with advanced features'
      },
      {
        title: 'Modal System',
        objective: 'Create a flexible modal system for dialogs and popups',
        prompt: `Implement a modal system featuring:
1. Multiple modal types
2. Animation transitions
3. Nested modal support
4. Keyboard navigation
5. Focus management`,
        outcome: 'Accessible modal system with smooth transitions'
      },
      {
        title: 'Theme System',
        objective: 'Build a theme system with dark mode support',
        prompt: `Create a theming system with:
1. Dark/light mode toggle
2. Custom color schemes
3. Theme persistence
4. Dynamic style application
5. CSS variable management`,
        outcome: 'Complete theme system with mode switching'
      }
    ],
    3: [ // Data Management
      {
        title: 'State Management',
        objective: 'Implement global state management with data persistence',
        prompt: `Set up state management including:
1. Store configuration
2. Action creators
3. Reducer implementation
4. Middleware setup
5. State persistence`,
        outcome: 'Robust state management system with persistence'
      },
      {
        title: 'API Integration',
        objective: 'Create a comprehensive API integration layer',
        prompt: `Build API integration with:
1. REST client setup
2. Request/response interceptors
3. Error handling
4. Cache management
5. Rate limiting`,
        outcome: 'Complete API integration layer with error handling'
      },
      {
        title: 'Real-time Updates',
        objective: 'Implement real-time data synchronization',
        prompt: `Create real-time functionality using:
1. WebSocket connection
2. Event handling
3. Data synchronization
4. Reconnection logic
5. Offline support`,
        outcome: 'Real-time update system with offline capabilities'
      },
      {
        title: 'Data Caching',
        objective: 'Build a caching system for improved performance',
        prompt: `Implement caching system with:
1. Cache strategy setup
2. Cache invalidation
3. Memory management
4. Persistence options
5. Cache preloading`,
        outcome: 'Efficient caching system with smart invalidation'
      },
      {
        title: 'Error Tracking',
        objective: 'Create comprehensive error tracking and reporting',
        prompt: `Build error tracking system including:
1. Error boundary setup
2. Log collection
3. Error reporting
4. User feedback
5. Debug information`,
        outcome: 'Complete error tracking with reporting capabilities'
      }
    ],
    4: [ // Performance
      {
        title: 'Code Splitting',
        objective: 'Implement code splitting and lazy loading',
        prompt: `Set up code optimization with:
1. Route-based splitting
2. Component lazy loading
3. Dynamic imports
4. Loading indicators
5. Prefetching strategy`,
        outcome: 'Optimized code loading with improved performance'
      },
      {
        title: 'Image Optimization',
        objective: 'Create an image optimization system',
        prompt: `Implement image handling including:
1. Responsive images
2. Format optimization
3. Lazy loading
4. Placeholder system
5. Cache strategy`,
        outcome: 'Efficient image loading and optimization system'
      },
      {
        title: 'Performance Monitoring',
        objective: 'Build performance monitoring and analytics',
        prompt: `Create monitoring system with:
1. Metric collection
2. Performance tracking
3. User timing
4. Error monitoring
5. Report generation`,
        outcome: 'Complete performance monitoring solution'
      },
      {
        title: 'Bundle Optimization',
        objective: 'Implement bundle size optimization',
        prompt: `Set up bundle optimization including:
1. Tree shaking
2. Dependency analysis
3. Chunk optimization
4. Asset compression
5. Cache busting`,
        outcome: 'Optimized bundle size with efficient loading'
      },
      {
        title: 'Memory Management',
        objective: 'Create memory leak prevention system',
        prompt: `Implement memory management with:
1. Cleanup utilities
2. Resource pooling
3. Memory monitoring
4. Leak detection
5. Automatic optimization`,
        outcome: 'Efficient memory management system'
      }
    ],
    5: [ // Testing & Quality
      {
        title: 'Unit Testing Setup',
        objective: 'Implement comprehensive unit testing',
        prompt: `Set up unit testing framework with:
1. Test runner configuration
2. Mock system setup
3. Coverage reporting
4. Test utilities
5. CI integration`,
        outcome: 'Complete unit testing system with coverage'
      },
      {
        title: 'Integration Testing',
        objective: 'Create integration testing framework',
        prompt: `Build integration tests including:
1. API test setup
2. Component integration
3. State management tests
4. Mock services
5. E2E scenarios`,
        outcome: 'Robust integration testing framework'
      },
      {
        title: 'Performance Testing',
        objective: 'Implement performance testing suite',
        prompt: `Create performance tests with:
1. Load testing setup
2. Benchmark tools
3. Metric collection
4. Regression testing
5. Report generation`,
        outcome: 'Comprehensive performance testing suite'
      },
      {
        title: 'Accessibility Testing',
        objective: 'Build accessibility testing framework',
        prompt: `Implement accessibility tests including:
1. ARIA validation
2. Keyboard navigation
3. Screen reader testing
4. Color contrast
5. Focus management`,
        outcome: 'Complete accessibility testing system'
      },
      {
        title: 'Security Testing',
        objective: 'Create security testing framework',
        prompt: `Set up security testing with:
1. Vulnerability scanning
2. Authentication tests
3. Authorization checks
4. Input validation
5. Security headers`,
        outcome: 'Comprehensive security testing framework'
      }
    ]
  };

  return prompts[stage] || [];
};