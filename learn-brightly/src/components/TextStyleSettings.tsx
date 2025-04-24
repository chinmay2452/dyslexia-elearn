
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
import { Type, TextCursor, AlignJustify, Palette } from 'lucide-react';

interface TextStyleSettings {
  fontSize: number;
  lineSpacing: number;
  useDyslexicFont: boolean;
  useHighContrast: boolean;
  backgroundColor: string;
}

const TextStyleSettings = () => {
  const [settings, setSettings] = useState<TextStyleSettings>({
    fontSize: 1,
    lineSpacing: 1,
    useDyslexicFont: true,
    useHighContrast: false,
    backgroundColor: 'default'
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--font-size-multiplier', settings.fontSize.toString());
    document.documentElement.style.setProperty('--line-spacing-multiplier', settings.lineSpacing.toString());
    
    if (settings.useDyslexicFont) {
      document.body.classList.add('use-dyslexic-font');
    } else {
      document.body.classList.remove('use-dyslexic-font');
    }
    
    if (settings.useHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    document.body.className = document.body.className
      .replace(/bg-pastel-\w+/g, '')
      .trim();
      
    if (settings.backgroundColor !== 'default') {
      document.body.classList.add(`bg-pastel-${settings.backgroundColor}`);
    }
  }, [settings]);

  const backgroundOptions = [
    { value: 'default', label: 'Default' },
    { value: 'yellow', label: 'Soft Yellow' },
    { value: 'blue', label: 'Soft Blue' },
    { value: 'green', label: 'Soft Green' },
    { value: 'peach', label: 'Soft Peach' }
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full" aria-label="Text Style Settings">
          <Type className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl">Text Style Settings</SheetTitle>
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
              <span className="text-sm">{Math.round(settings.fontSize * 100)}%</span>
            </div>
            <Slider 
              id="font-size"
              min={0.8} 
              max={1.5} 
              step={0.05} 
              value={[settings.fontSize]}
              onValueChange={([value]) => setSettings({...settings, fontSize: value})}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlignJustify className="h-4 w-4" />
                <Label htmlFor="line-spacing">Line Spacing</Label>
              </div>
              <span className="text-sm">{Math.round(settings.lineSpacing * 100)}%</span>
            </div>
            <Slider 
              id="line-spacing"
              min={1} 
              max={2} 
              step={0.1} 
              value={[settings.lineSpacing]}
              onValueChange={([value]) => setSettings({...settings, lineSpacing: value})}
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
              <Palette className="h-4 w-4" />
              <Label htmlFor="high-contrast">High Contrast</Label>
            </div>
            <Switch 
              id="high-contrast"
              checked={settings.useHighContrast}
              onCheckedChange={(checked) => setSettings({...settings, useHighContrast: checked})}
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="background-color" className="block mb-2">Background Color</Label>
            <div className="grid grid-cols-3 gap-2">
              {backgroundOptions.map(option => (
                <Button 
                  key={option.value}
                  variant={settings.backgroundColor === option.value ? "default" : "outline"}
                  className={`h-12 rounded-xl ${option.value !== 'default' ? `bg-pastel-${option.value}` : ''}`}
                  onClick={() => setSettings({...settings, backgroundColor: option.value})}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="p-4 rounded-xl border bg-muted">
            <h3 className="font-bold mb-2">Preview Text</h3>
            <p>This is how your text will appear throughout the app.</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TextStyleSettings;
