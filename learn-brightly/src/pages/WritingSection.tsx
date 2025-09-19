import React, { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/tabs';
import { Button } from '../components/button';
import { Card, CardContent } from '../components/card';
import { 
  Upload, 
  Pencil, 
  BookOpen, 
  Type, 
  FileImage, 
  X,
  Sparkles,
  CheckCircle
} from 'lucide-react';

interface TutorialCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onStart: () => void;
}

const TutorialCard: React.FC<TutorialCardProps> = ({ icon, title, description, onStart }) => (
  <Card className="group hover:scale-105 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-pastel-purple/20 to-pastel-blue/20 border-pastel-purple/30">
    <CardContent className="p-6 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-pastel-purple/20 rounded-full flex items-center justify-center group-hover:bg-pastel-purple/30 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
      <Button 
        onClick={onStart}
        className="w-full bg-pastel-purple hover:bg-pastel-purple/80 text-white rounded-xl py-3 font-semibold transition-all duration-200 hover:shadow-md"
      >
        Start Tutorial
      </Button>
    </CardContent>
  </Card>
);

const WritingSection: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('File details:', {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      lastModified: selectedFile.lastModified
    });
    
    setIsUploading(false);
    
    // Reset form
    handleRemoveFile();
  };

  const handleTutorialStart = (tutorialName: string) => {
    console.log(`Starting tutorial: ${tutorialName}`);
    // TODO: Implement tutorial navigation
  };

  const tutorials = [
    {
      icon: <Pencil className="w-8 h-8 text-pastel-purple" />,
      title: "Letter Writing",
      description: "Learn to write letters with proper form and spacing. Practice uppercase and lowercase letters step by step."
    },
    {
      icon: <BookOpen className="w-8 h-8 text-blue-500" />,
      title: "Word Formation",
      description: "Build words from letters and understand how letters work together to create meaning."
    },
    {
      icon: <Type className="w-8 h-8 text-green-500" />,
      title: "Sentence Practice",
      description: "Write complete sentences with proper grammar, punctuation, and clear handwriting."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Writing Practice</h2>
        <p className="text-gray-600 text-lg">
          Improve your handwriting and writing skills with interactive tutorials and practice exercises.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-pastel-blue/20 rounded-xl p-1 mb-8">
          <TabsTrigger 
            value="upload" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold"
          >
            Upload Practice
          </TabsTrigger>
          <TabsTrigger 
            value="tutorials" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold"
          >
            Tutorials
          </TabsTrigger>
          <TabsTrigger 
            value="feedback" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold"
          >
            Feedback
          </TabsTrigger>
        </TabsList>

        {/* Upload Practice Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card className="bg-gradient-to-br from-pastel-peach/30 to-pastel-purple/20 border-pastel-purple/30 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-pastel-purple/20 rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-pastel-purple" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Upload Your Writing Practice</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Take a photo of your handwritten practice and upload it for review and feedback.
                </p>

                {!selectedFile ? (
                  <div className="space-y-4">
                    <Button
                      onClick={handleUploadClick}
                      className="bg-pastel-purple hover:bg-pastel-purple/80 text-white rounded-xl py-4 px-8 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <FileImage className="w-6 h-6 mr-2" />
                      Choose Image File
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-500">
                      Supported formats: JPG, PNG, GIF (Max 10MB)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative max-w-md mx-auto">
                      <img
                        src={previewUrl!}
                        alt="Upload preview"
                        className="w-full h-64 object-cover rounded-xl shadow-md"
                      />
                      <Button
                        onClick={handleRemoveFile}
                        variant="outline"
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white w-8 h-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="bg-white/50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>File:</strong> {selectedFile.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={handleSubmit}
                        disabled={isUploading}
                        className="bg-pastel-green hover:bg-pastel-green/80 text-white rounded-xl py-3 px-6 font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                      >
                        {isUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Submit Practice
                          </>
                        )}
                      </Button>
                      
                      <Button
                        onClick={handleRemoveFile}
                        variant="outline"
                        className="rounded-xl py-3 px-6 font-semibold"
                      >
                        Choose Different File
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tutorials Tab */}
        <TabsContent value="tutorials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tutorials.map((tutorial, index) => (
              <TutorialCard
                key={index}
                icon={tutorial.icon}
                title={tutorial.title}
                description={tutorial.description}
                onStart={() => handleTutorialStart(tutorial.title)}
              />
            ))}
          </div>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-6">
          <Card className="bg-gradient-to-br from-pastel-blue/20 to-pastel-green/20 border-pastel-blue/30 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-pastel-blue/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-pastel-blue" />
              </div>
              
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                Coming Soon: AI-Powered Feedback!
              </h3>
              
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                We're working on an amazing AI system that will analyze your handwriting, 
                provide personalized feedback, and help you improve your writing skills. 
                Stay tuned for this exciting feature!
              </p>
              
              <div className="mt-8 p-4 bg-white/50 rounded-xl max-w-md mx-auto">
                <p className="text-sm text-gray-600">
                  <strong>Features coming soon:</strong>
                </p>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>• Handwriting analysis</li>
                  <li>• Personalized improvement tips</li>
                  <li>• Progress tracking</li>
                  <li>• Interactive corrections</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WritingSection;
