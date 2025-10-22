"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { PlusCircle } from "lucide-react";
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
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
        <button
          type="button"
          className="bg-background rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center flex-col p-6 text-center"
        >
          <span className="mb-3">
            <PlusCircle size={50} />
          </span>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            Start New Roadmap
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Add a new topic to your learning path.
          </p>
        </button>
      </DialogTrigger>
      <DialogContent>
        <VisuallyHidden>
          <DialogTitle>Generate New Roadmap</DialogTitle>
        </VisuallyHidden>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="topic"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="answer">Roadmap Title</FieldLabel>
                <Input
                  {...field}
                  id="answer"
                  placeholder="Type your roadmap title here..."
                  autoComplete="off"
                  autoCorrect="off"
                  className="ml-1"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button className="mt-2" type="submit">
            {isGenerating ? <Spinner /> : "Generate Roadmap"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
