'use client'

import { createMessageSchema, MessageSchemaType } from "@/app/schemas/message";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MessageComposer } from "./MessageComposer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { useState } from "react";
import { useAttachmentUpload } from "@/hooks/use-attachment-upload";

interface iAppProps {
    channelId: string
}

export function MessageInputForm({ channelId }: iAppProps) {
   const queryClient =useQueryClient()
   const [editorKey, setEditorKey] = useState(0)
   const uploap = useAttachmentUpload()

    const form = useForm({
        resolver: zodResolver(createMessageSchema),
        defaultValues: {
            channelId: channelId,
            content: ""
        }
    })

    const createMessageMutation = useMutation(
        orpc.message.create.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: orpc.message.list.key()
                })

                form.reset({ channelId, content:''})
                uploap.clear()
                setEditorKey((k) => k + 1)

                return toast.success('message created successfully')
            },
            onError: () => {
                return toast.error('something went wrong')
            }
        })
    )


    function onSubmit(data: MessageSchemaType) {
        createMessageMutation.mutate({
            ...data,
            imageUrl: uploap.stagedUrl ?? undefined
        })
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <MessageComposer
                                    key={editorKey}
                                    value={field.value}
                                    onChange={field.onChange}
                                    onSubmit={() => onSubmit(form.getValues())}
                                    isSubmitting={createMessageMutation.isPending}
                                    upload={uploap}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}