"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { generateRoadmap } from "@/lib/actions";

const formSchema = z.object({
  topic: z.string().min(3, { error: "Min 3 characters" }),
});

export default function NewRoadmapCard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    try {
      await generateRoadmap(values.topic);
    } catch (err) {
      console.log(err);
    } finally {
      setIsGenerating(false);
      setIsDialogOpen(false);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2">
          <Plus />
          <span>Create New Roadmap</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>New Roadmap</DialogTitle>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="topic"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  id="answer"
                  placeholder="Roadmap title..."
                  autoComplete="off"
                  autoCorrect="off"
                  className="bg-white text-sm"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button className="mt-6" type="submit">
            {isGenerating ? <Spinner /> : "Generate"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
