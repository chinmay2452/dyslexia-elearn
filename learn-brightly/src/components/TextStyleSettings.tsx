import React, { useState, useEffect } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger
} from "../components/sheet";
import { Slider } from "../components/slider";
import { Label } from "../components/label";
import { Button } from "../components/button";
import { Switch } from "../components/switch";
import { Type, TextCursor, AlignJustify, Eye, RotateCcw } from 'lucide-react';
import { cn } from "../lib/utils";

interface TextStyleSettings {
  fontSize: number;
  lineSpacing: number;
  useDyslexicFont: boolean;
  useHighContrast: boolean;
  letterSpacing: number;
}

const defaultSettings: TextStyleSettings = {
  fontSize: 1,
  lineSpacing: 1.5,
  useDyslexicFont: true,
  useHighContrast: false,
  letterSpacing: 0
};

const TextStyleSettings = () => {
  const [settings, setSettings] = useState<TextStyleSettings>(defaultSettings);
  const [isOpen, setIsOpen] = useState(false);

  // Apply styles to root element for global effect
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply font size multiplier to all text
    root.style.setProperty('--font-size-multiplier', settings.fontSize.toString());
    root.style.setProperty('--line-spacing-multiplier', settings.lineSpacing.toString());
    root.style.setProperty('--letter-spacing', `${settings.letterSpacing}px`);
    
    // Apply font family globally
    if (settings.useDyslexicFont) {
      root.style.setProperty('--font-family', "'OpenDyslexic', system-ui, sans-serif");
    } else {
      root.style.setProperty('--font-family', 'system-ui, sans-serif');
    }
    
    // Apply high contrast mode
    if (settings.useHighContrast) {
      root.style.setProperty('--text-color', '#000000');
      root.style.setProperty('--background-color', '#FFFFFF');
      root.style.setProperty('--link-color', '#0000EE');
      root.style.setProperty('--visited-color', '#551A8B');
      document.body.classList.add('high-contrast');
    } else {
      root.style.setProperty('--text-color', '');
      root.style.setProperty('--background-color', '');
      root.style.setProperty('--link-color', '');
      root.style.setProperty('--visited-color', '');
      document.body.classList.remove('high-contrast');
    }

    // Add global styles
    const styleElement = document.getElementById('global-text-styles') || document.createElement('style');
    styleElement.id = 'global-text-styles';
    styleElement.textContent = `
      :root {
        font-size: calc(16px * var(--font-size-multiplier, 1));
        color: #000000;
      }
      
      * {
        font-family: var(--font-family, inherit) !important;
        letter-spacing: var(--letter-spacing, normal) !important;
        line-height: calc(1.5 * var(--line-spacing-multiplier, 1)) !important;
        color: #000000 !important;
      }
      
      .high-contrast * {
        color: var(--text-color) !important;
        background-color: var(--background-color) !important;
      }
      
      .high-contrast a {
        color: var(--link-color) !important;
      }
      
      .high-contrast a:visited {
        color: var(--visited-color) !important;
      }
      
      .high-contrast button,
      .high-contrast input,
      .high-contrast select,
      .high-contrast textarea {
        border: 2px solid var(--text-color) !important;
      }
    `;
    
    if (!document.getElementById('global-text-styles')) {
      document.head.appendChild(styleElement);
    }

    // Save settings to localStorage for persistence
    localStorage.setItem('textStyleSettings', JSON.stringify(settings));
  }, [settings]);

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('textStyleSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full hover:bg-pastel-blue/20 transition-colors" 
          aria-label="Text Style Settings"
        >
          <Type className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl flex items-center gap-2">
            <Type className="h-6 w-6" />
            Text Style Settings
          </SheetTitle>
          <SheetDescription>
            Adjust text appearance for easier reading
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TextCursor className="h-4 w-4" />
                <Label htmlFor="font-size">Font Size</Label>
              </div>
              <span className="text-sm font-medium">{Math.round(settings.fontSize * 100)}%</span>
            </div>
            <Slider 
              id="font-size"
              min={0.8} 
              max={1.5} 
              step={0.05} 
              value={[settings.fontSize]}
              onValueChange={([value]) => setSettings({...settings, fontSize: value})}
              className="py-2"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlignJustify className="h-4 w-4" />
                <Label htmlFor="line-spacing">Line Spacing</Label>
              </div>
              <span className="text-sm font-medium">{Math.round(settings.lineSpacing * 100)}%</span>
            </div>
            <Slider 
              id="line-spacing"
              min={1} 
              max={2.5} 
              step={0.1} 
              value={[settings.lineSpacing]}
              onValueChange={([value]) => setSettings({...settings, lineSpacing: value})}
              className="py-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TextCursor className="h-4 w-4" />
                <Label htmlFor="letter-spacing">Letter Spacing</Label>
              </div>
              <span className="text-sm font-medium">{settings.letterSpacing}px</span>
            </div>
            <Slider 
              id="letter-spacing"
              min={0} 
              max={2} 
              step={0.1} 
              value={[settings.letterSpacing]}
              onValueChange={([value]) => setSettings({...settings, letterSpacing: value})}
              className="py-2"
            />
          </div>
          
          <div className="flex items-center justify-between space-y-0 py-2">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <Label htmlFor="dyslexic-font">Use Dyslexia Font</Label>
            </div>
            <Switch 
              id="dyslexic-font"
              checked={settings.useDyslexicFont}
              onCheckedChange={(checked) => setSettings({...settings, useDyslexicFont: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between space-y-0 py-2">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <Label htmlFor="high-contrast">High Contrast</Label>
            </div>
            <Switch 
              id="high-contrast"
              checked={settings.useHighContrast}
              onCheckedChange={(checked) => setSettings({...settings, useHighContrast: checked})}
            />
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <h3 className="font-bold">Preview</h3>
            </div>
            <Button 
              variant="outline" 
              size="default" 
              onClick={resetSettings}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
          <div className="p-4 rounded-xl border transition-all">
            <p className={cn(
              "transition-all",
              settings.useDyslexicFont && "font-dyslexic"
            )}>
              This is how your text will appear throughout the app. The changes you make here will affect all text on the website, making it easier for you to read and understand the content.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TextStyleSettings;
