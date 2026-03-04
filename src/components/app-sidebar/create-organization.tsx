import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function CreateOrganizationDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Create Organization</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
        </DialogHeader>
        <DialogDescription>Create a new organization to get started.</DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
