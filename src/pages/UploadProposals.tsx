import { AppLayout } from '@/components/AppLayout';
import { ProposalUploader } from '@/components/proposals/ProposalUploader';

export default function UploadProposals() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Proposals</h1>
          <p className="text-muted-foreground">
            Upload your past proposals to build your library. Sensitive information 
            will be automatically detected and redacted for privacy.
          </p>
        </div>
        
        <ProposalUploader />
      </div>
    </AppLayout>
  );
}
