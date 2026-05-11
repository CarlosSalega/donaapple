"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { TestimonialInput } from "@/server/actions/testimonials/testimonials";

import { Button } from "@/shared/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { SiteConfigForm } from "@/features/landing/components/site-config-form";
import { TestimonialForm } from "./testimonial-form";
import { TestimonialsTable } from "./testimonials-table";
import { Plus } from "lucide-react";

type Testimonial = TestimonialInput & { id: string; createdAt: Date };

type StoreFeature = {
  title: string;
  description: string;
};

type ConfigData = Record<
  string,
  string | boolean | string[] | StoreFeature[] | undefined
>;

interface TestimoniosClientProps {
  testimonials: Testimonial[];
  config: ConfigData;
}

export function TestimoniosClient({
  testimonials,
  config,
}: TestimoniosClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("testimonios");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<Testimonial> | null>(null);

  const handleNew = () => {
    setEditData({
      name: "",
      avatar: "",
      rating: 5,
      text: "",
      order: testimonials.length,
      isActive: true,
    });
    setDialogOpen(true);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditData(testimonial);
    setDialogOpen(true);
  };

  const handleSuccess = () => {
    setDialogOpen(false);
    router.refresh();
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Testimonios</h1>
          <p className="text-muted-foreground text-sm">
            Gestioná los testimonios y textos de la sección
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Testimonio
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="testimonios">Testimonios</TabsTrigger>
          <TabsTrigger value="config">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="testimonios">
          <TestimonialsTable testimonials={testimonials} onEdit={handleEdit} />
        </TabsContent>

        <TabsContent value="config">
          <SiteConfigForm config={config} section="testimonials" />
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editData?.id ? "Editar Testimonio" : "Nuevo Testimonio"}
            </DialogTitle>
          </DialogHeader>
          <TestimonialForm
            initialData={editData ?? undefined}
            testimonialId={editData?.id || undefined}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
