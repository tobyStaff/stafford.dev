# Galaxy Page Development Plan

## Overview
The Galaxy page will feature an Observable Plot visualization displaying social media posts that make predictions as an interactive scatter plot of colored nodes. Users can explore nodes by clicking for details and hovering for previews.

## Core Features
- **Scatter Plot**: Interactive visualization with Observable Plot
- **Node Representation**: Each social media prediction post as a node
- **Color Coding**: Nodes grouped and colored by subject/topic
- **Interactivity**: Click for full post details, hover for preview
- **Modal/Dialogue**: Inline post display with full content

## Staged Development Plan

### **Stage 1: Foundation & Dependencies**
- [x] Install Observable Plot and D3 dependencies
- [ ] Set up basic Galaxy component structure with Plot container
- [ ] Create mock dataset structure for social media prediction posts
- [ ] Replace current Galaxy page with visualization framework

**Files to modify:**
- `package.json` (add dependencies)
- `client/src/pages/Galaxy.jsx` (rebuild component)

### **Stage 2: Data Architecture**
- [ ] Design data model for prediction posts
  - Fields: id, content, author, platform, topic, sentiment, confidence, date, coordinates
- [ ] Create backend API endpoints for fetching prediction data
  - `GET /api/galaxy/predictions` - fetch all predictions
  - `GET /api/galaxy/predictions/:id` - fetch single prediction
  - `GET /api/galaxy/topics` - fetch available topics
- [ ] Implement data processing utilities
  - Topic clustering algorithms
  - Node positioning calculations
  - Data normalization functions

**Files to create/modify:**
- `routes/galaxy.js` (expand API endpoints)
- `models/Prediction.js` (new data model)
- `client/src/utils/galaxyData.js` (data processing utilities)

### **Stage 3: Basic Visualization**
- [ ] Create Observable Plot scatter plot with X/Y positioning
- [ ] Implement topic-based color coding for nodes
- [ ] Add basic node sizing based on engagement/importance metrics
- [ ] Set up responsive plot dimensions
- [ ] Basic axis labels and legends

**Key components:**
- Plot configuration with marks (dots, text labels)
- Color scale mapping topics to colors
- Size scale mapping metrics to node size
- Responsive container sizing

### **Stage 4: Interactivity Layer**
- [ ] Add click handlers for node selection
- [ ] Implement hover tooltips with post preview
- [ ] Create modal/dialogue component for full post display
- [ ] Add zoom and pan functionality
- [ ] Selection state management

**Files to create:**
- `client/src/components/PostModal.jsx` (full post display)
- `client/src/components/PostTooltip.jsx` (hover preview)
- `client/src/hooks/useGalaxyInteraction.js` (interaction logic)

### **Stage 5: Advanced Features**
- [ ] Topic filtering/grouping controls
  - Sidebar with topic checkboxes
  - Dynamic plot updates
- [ ] Time-based filtering (date ranges)
- [ ] Search functionality within posts
- [ ] Performance optimization for large datasets
  - Virtual rendering for 1000+ nodes
  - Data pagination/lazy loading
- [ ] Node clustering algorithms
  - Force-directed positioning
  - Topic-based grouping

**Files to create:**
- `client/src/components/GalaxyControls.jsx` (filtering interface)
- `client/src/components/SearchBar.jsx` (search functionality)
- `client/src/utils/clustering.js` (positioning algorithms)

### **Stage 6: Polish & Integration**
- [ ] Smooth animations and transitions
  - Node entrance/exit animations
  - Color/size transition effects
- [ ] Mobile responsive design
  - Touch interactions
  - Responsive control panels
- [ ] Loading states and error handling
  - Skeleton screens
  - Error boundaries
- [ ] Integration with existing auth system
- [ ] Performance monitoring
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)

## Technical Specifications

### **Data Model**
```javascript
{
  id: string,
  content: string,
  author: {
    name: string,
    platform: string,
    handle: string
  },
  topic: string,
  subtopic?: string,
  sentiment: number, // -1 to 1
  confidence: number, // 0 to 1
  engagement: {
    likes: number,
    shares: number,
    comments: number
  },
  prediction: {
    subject: string,
    outcome: string,
    timeframe: string
  },
  coordinates: {
    x: number,
    y: number
  },
  createdAt: date,
  sourceUrl?: string
}
```

### **Visualization Mapping**
- **X/Y Position**: Algorithmic clustering by topic similarity
- **Color**: Topic/subject categorization (categorical color scale)
- **Size**: Confidence level or engagement metrics
- **Opacity**: Recency or relevance score

### **Color Scheme**
- Technology: Blue (`#3B82F6`)
- Politics: Red (`#EF4444`)
- Economics: Green (`#10B981`)
- Sports: Orange (`#F59E0B`)
- Entertainment: Purple (`#8B5CF6`)
- Science: Teal (`#14B8A6`)
- Default: Gray (`#6B7280`)

### **Dependencies to Add**
```json
{
  "@observablehq/plot": "^0.6.x",
  "d3": "^7.x",
  "d3-force": "^3.x" // for clustering algorithms
}
```

## Implementation Priority
1. **High Priority**: Basic visualization with static data
2. **Medium Priority**: Interactive features and backend integration
3. **Low Priority**: Advanced filtering and performance optimizations

## Success Metrics
- [ ] Visualization renders 500+ nodes smoothly
- [ ] Interactive features respond within 100ms
- [ ] Mobile experience maintains usability
- [ ] Accessible to screen readers and keyboard users
- [ ] Data updates in real-time without page refresh

---

*This plan will be updated as development progresses and requirements evolve.*