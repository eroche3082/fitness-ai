import React, { useState, useEffect } from 'react';
import { X, FileDown, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhaseTracker from './PhaseTracker';
import TabStatusTracker from './TabStatusTracker';

// Phase status type
type PhaseStatus = 'pending' | 'in_progress' | 'complete';

// Phase item interface
interface PhaseItem {
  id: string;
  label: string;
  completed: boolean;
}

// Phase interface
interface Phase {
  id: string;
  title: string;
  status: PhaseStatus;
  items: PhaseItem[];
  notes: string;
}

// Status badge colors
const statusColors = {
  pending: 'bg-gray-500',
  in_progress: 'bg-yellow-500',
  complete: 'bg-green-500',
};

// Default phases data
const defaultPhases: Phase[] = [
  {
    id: 'phase0',
    title: 'PHASE 0: Initialization',
    status: 'complete',
    notes: '',
    items: [
      { id: 'phase0-1', label: 'App skeleton created (file structure, folders, base config)', completed: true },
      { id: 'phase0-2', label: '.env and AppSecrets loaded', completed: true },
      { id: 'phase0-3', label: 'Firebase / Backend connected', completed: true },
      { id: 'phase0-4', label: 'Replit project initialized', completed: true },
      { id: 'phase0-5', label: 'GitHub repo linked (if used)', completed: false },
    ]
  },
  {
    id: 'phase1',
    title: 'PHASE 1: Layout & UI Base',
    status: 'in_progress',
    notes: '',
    items: [
      { id: 'phase1-1', label: 'Header / Navbar implemented', completed: true },
      { id: 'phase1-2', label: 'Side Panel Menu with all tabs', completed: true },
      { id: 'phase1-3', label: 'Footer bar with Admin Panel trigger', completed: false },
      { id: 'phase1-4', label: 'Responsive layout configured (mobile + desktop)', completed: true },
      { id: 'phase1-5', label: 'Route navigation for each tab working', completed: true },
    ]
  },
  {
    id: 'phase2',
    title: 'PHASE 2: Chatbot System Core',
    status: 'in_progress',
    notes: '',
    items: [
      { id: 'phase2-1', label: 'Chatbot floating icon visible', completed: true },
      { id: 'phase2-2', label: 'FullPage chatbot opens on click', completed: true },
      { id: 'phase2-3', label: 'Vertex AI connected', completed: true },
      { id: 'phase2-4', label: 'Audio input/output active', completed: true },
      { id: 'phase2-5', label: 'Multilingual support tested', completed: true },
      { id: 'phase2-6', label: 'Firebase context memory active', completed: false },
      { id: 'phase2-7', label: 'Onboarding flow (10–15 questions) implemented', completed: true },
      { id: 'phase2-8', label: 'Responses stored in subscriber dashboard', completed: true },
    ]
  },
  {
    id: 'phase3',
    title: 'PHASE 3: Tab-by-Tab Module Integration',
    status: 'in_progress',
    notes: '',
    items: [
      { id: 'phase3-1', label: 'Tab 1: Dashboard', completed: true },
      { id: 'phase3-2', label: 'Tab 2: Data / Analytics', completed: false },
      { id: 'phase3-3', label: 'Tab 3: Explore / Library', completed: false },
      { id: 'phase3-4', label: 'Tab 4: Profile / Preferences', completed: true },
      { id: 'phase3-5', label: 'Tab 5: Smart Tools / AI', completed: false },
    ]
  },
  {
    id: 'phase4',
    title: 'PHASE 4: User Personalization',
    status: 'complete',
    notes: 'Implemented all six modules: onboardingFlow, subscriberSchema, profileService, DashboardRenderer, promptService, and updated useUserProfile.',
    items: [
      { id: 'phase4-1', label: 'Subscriber profile system active', completed: true },
      { id: 'phase4-2', label: 'User data stored in Firebase', completed: true },
      { id: 'phase4-3', label: 'Personalized dashboard rendering', completed: true },
      { id: 'phase4-4', label: 'Avatar or name used by chatbot', completed: true },
      { id: 'phase4-5', label: 'Recommendations or dynamic views based on data', completed: true },
    ]
  },
  {
    id: 'phase5',
    title: 'PHASE 5: External Integrations',
    status: 'in_progress',
    notes: '',
    items: [
      { id: 'phase5-1', label: 'Stripe connected (test mode)', completed: false },
      { id: 'phase5-2', label: 'News API / YouTube / Maps working', completed: true },
      { id: 'phase5-3', label: 'Google APIs (Vision, TTS, STT, Translate)', completed: true },
      { id: 'phase5-4', label: 'Webhooks or third-party APIs operational', completed: false },
    ]
  },
  {
    id: 'phase6',
    title: 'PHASE 6: Testing & QA',
    status: 'pending',
    notes: '',
    items: [
      { id: 'phase6-1', label: 'Mobile testing', completed: false },
      { id: 'phase6-2', label: 'Tablet testing', completed: false },
      { id: 'phase6-3', label: 'Multibrowser test', completed: false },
      { id: 'phase6-4', label: 'Loading and error states verified', completed: false },
      { id: 'phase6-5', label: 'Chatbot tested in each tab', completed: false },
    ]
  },
  {
    id: 'phase7',
    title: 'PHASE 7: Admin Tools',
    status: 'in_progress',
    notes: 'Currently implementing Admin Panel',
    items: [
      { id: 'phase7-1', label: 'Admin dashboard', completed: false },
      { id: 'phase7-2', label: 'System diagnostics panel added', completed: false },
      { id: 'phase7-3', label: 'Ability to mark phase checkboxes manually', completed: false },
    ]
  },
  {
    id: 'phase8',
    title: 'PHASE 8: Pre-Launch Prep',
    status: 'pending',
    notes: '',
    items: [
      { id: 'phase8-1', label: 'SEO basics (title, meta)', completed: false },
      { id: 'phase8-2', label: 'Privacy + terms pages linked', completed: false },
      { id: 'phase8-3', label: 'Social icons / links added', completed: false },
      { id: 'phase8-4', label: 'Contact form or email integrated', completed: false },
    ]
  },
  {
    id: 'phase9',
    title: 'PHASE 9: Deployment',
    status: 'pending',
    notes: '',
    items: [
      { id: 'phase9-1', label: 'Firebase Hosting connected', completed: false },
      { id: 'phase9-2', label: 'Custom domain linked', completed: false },
      { id: 'phase9-3', label: 'SSL active', completed: false },
      { id: 'phase9-4', label: 'Post-deploy test run completed', completed: false },
      { id: 'phase9-5', label: 'Final admin checklist saved', completed: false },
    ]
  },
];

// Function to calculate status based on completed items
function calculateStatus(items: PhaseItem[]): PhaseStatus {
  if (items.length === 0) return 'pending';
  
  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  
  if (completedCount === 0) return 'pending';
  if (completedCount === totalCount) return 'complete';
  return 'in_progress';
}

// Main AdminPanel component
export default function AdminPanel() {
  const [open, setOpen] = useState(false);
  const [phases, setPhases] = useState<Phase[]>(defaultPhases);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  // Toggle open/close
  const toggleOpen = () => setOpen(!open);

  // Toggle item completion
  const toggleItemCompletion = (phaseId: string, itemId: string) => {
    setPhases(prev => 
      prev.map(phase => {
        if (phase.id === phaseId) {
          const updatedItems = phase.items.map(item => 
            item.id === itemId ? { ...item, completed: !item.completed } : item
          );
          
          // Recalculate phase status
          const status = calculateStatus(updatedItems);
          
          return {
            ...phase,
            items: updatedItems,
            status
          };
        }
        return phase;
      })
    );
  };

  // Update notes for a phase
  const updateNotes = (phaseId: string, notes: string) => {
    setPhases(prev => 
      prev.map(phase => 
        phase.id === phaseId ? { ...phase, notes } : phase
      )
    );
  };

  // Toggle expanded sections
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Export system log
  const exportSystemLog = () => {
    // Create a JSON string of the current phases
    const dataStr = JSON.stringify(phases, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    // Create a download link and trigger it
    const exportFileDefaultName = `fitness-ai-system-log-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Calculate overall progress
  const calculateOverallProgress = (): number => {
    const allItems = phases.flatMap(phase => phase.items);
    const completedItems = allItems.filter(item => item.completed);
    return Math.round((completedItems.length / allItems.length) * 100);
  };

  return (
    <>
      {/* Admin Panel Trigger Button */}
      <Button
        onClick={toggleOpen}
        variant="outline"
        size="sm"
        className="fixed bottom-4 left-4 z-50 flex items-center gap-1 opacity-70 hover:opacity-100"
      >
        <Settings className="h-4 w-4" />
        <span className="text-xs">Admin</span>
      </Button>

      {/* Admin Panel Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center justify-between">
              <span>Fitness AI - Admin Panel</span>
              <Badge className="ml-2">
                Progress: {calculateOverallProgress()}%
              </Badge>
            </SheetTitle>
            <SheetDescription>
              Development phase tracking and system verification
            </SheetDescription>
          </SheetHeader>

          <Tabs defaultValue="checklist" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="checklist">Checklist</TabsTrigger>
              <TabsTrigger value="diagnostic">System Diagnostic</TabsTrigger>
              <TabsTrigger value="tabs">Tab Status</TabsTrigger>
            </TabsList>
            
            <TabsContent value="checklist" className="mt-4">
              {/* Phases Accordion */}
              <div className="my-4">
                <Accordion type="multiple" value={expandedSections} className="w-full">
                  {phases.map((phase) => (
                    <AccordionItem key={phase.id} value={phase.id} className="border-b">
                      <AccordionTrigger 
                        onClick={() => toggleSection(phase.id)} 
                        className="py-2 hover:no-underline"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm font-medium text-left flex-1">{phase.title}</span>
                          <Badge className={`${statusColors[phase.status]} ml-2`}>
                            {phase.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 py-2">
                          {/* Phase Checklist */}
                          <div className="space-y-2">
                            {phase.items.map((item) => (
                              <div key={item.id} className="flex items-start gap-2">
                                <Checkbox
                                  id={item.id}
                                  checked={item.completed}
                                  onCheckedChange={() => toggleItemCompletion(phase.id, item.id)}
                                  className="mt-0.5"
                                />
                                <label
                                  htmlFor={item.id}
                                  className={`text-sm ${
                                    item.completed ? 'line-through text-muted-foreground' : ''
                                  }`}
                                >
                                  {item.label}
                                </label>
                              </div>
                            ))}
                          </div>

                          {/* Notes Section */}
                          <div>
                            <label className="text-sm text-muted-foreground mb-1 block">
                              Notes:
                            </label>
                            <Textarea
                              placeholder="Add notes for this phase..."
                              value={phase.notes}
                              onChange={(e) => updateNotes(phase.id, e.target.value)}
                              className="min-h-[80px] text-sm"
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>
            
            <TabsContent value="diagnostic">
              <PhaseTracker />
            </TabsContent>
            
            <TabsContent value="tabs">
              <TabStatusTracker />
            </TabsContent>
          </Tabs>

          <SheetFooter className="flex justify-between items-center mt-4">
            <Button 
              variant="outline" 
              onClick={exportSystemLog}
              className="flex items-center"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Export System Log
            </Button>
            <Button variant="default" onClick={() => setOpen(false)}>
              Close
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}