import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, User } from 'lucide-react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';

interface ProfileSetupDialogProps {
  open: boolean;
}

export default function ProfileSetupDialog({ open }: ProfileSetupDialogProps) {
  const [name, setName] = useState('');
  const saveProfileMutation = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('يرجى إدخال اسمك');
      return;
    }

    try {
      await saveProfileMutation.mutateAsync({ name: name.trim() });
      toast.success('تم حفظ الملف الشخصي بنجاح');
      setName('');
    } catch (error) {
      toast.error('فشل في حفظ الملف الشخصي');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mx-auto rounded-full bg-cyan-500/10 p-4 w-fit mb-2">
            <User className="h-8 w-8 text-cyan-500" />
          </div>
          <DialogTitle className="text-center text-2xl">مرحباً بك!</DialogTitle>
          <DialogDescription className="text-center">
            يرجى إدخال اسمك لإكمال إعداد حسابك
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم الكامل</Label>
            <Input
              id="name"
              type="text"
              placeholder="أدخل اسمك الكامل"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={saveProfileMutation.isPending}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700"
              disabled={saveProfileMutation.isPending || !name.trim()}
            >
              {saveProfileMutation.isPending ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جارٍ الحفظ...
                </>
              ) : (
                'حفظ'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
