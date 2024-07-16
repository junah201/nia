import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { postURL } from '@/api/url';
import { CustomInput } from '@/components/CustomInput';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { INPUT, RegisterField } from '@/constants/form';
import { useCustomMutation } from '@/lib/Query';

interface UrlFormProps {
  shortUrl: string | null;
  setShortUrl: (url: string) => void;
}

const UrlForm = ({ shortUrl, setShortUrl }: UrlFormProps) => {
  const form = useForm<RegisterField, any>({
    defaultValues: {
      [INPUT.ORIGINAL_URL['name']]: '',
      [INPUT.EXPIRED_AT['name']]: '1 month',
    },
  });
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const { mutate, isLoading } = useCustomMutation(
    (userInput) => postURL(userInput),
    {
      SuccessMessage: `단축 URL이 생성되었습니다.`,
      onSuccess: (res) => {
        setShortUrl(res.data.short_url);
      },
      ErrorMessage: `단축 URL 생성 실패`,
    }
  );

  return (
    <div className="w-full p-8 border shadow-sm rounded-lg space-y-4">
      <Form {...form}>
        <form onSubmit={handleSubmit((userInput) => mutate(userInput))}>
          <div className="space-y-2">
            <CustomInput {...INPUT.ORIGINAL_URL} control={control} />
            <CustomInput {...INPUT.EXPIRED_AT} control={control} />
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              color={!Object.keys(errors)[0] ? 'primary' : 'secondary'}
              className="w-full font-bold"
            >
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 size={16} className="mr-2 h-4 w-4 animate-spin" />
                  링크 단축중...
                </>
              ) : (
                <>링크 단축하기</>
              )}
            </Button>
          </div>
        </form>
      </Form>
      <ShortURL url={shortUrl} />
    </div>
  );
};

const ShortURL = ({ url }: { url: string | null }) => {
  const { toast } = useToast();

  if (!url) return null;

  const fullUrl = `https://it.nia.junah.dev/${url}`;

  return (
    <div className="flex flex-col sm:flex-row space-y-1 justify-between items-center w-full space-x-2 text-center bg-secondary p-4 border shadow-sm rounded-lg">
      <p
        className="text-lg font-bold text-primary"
        style={{ wordBreak: 'break-all' }}
      >
        {fullUrl}
      </p>
      <Button
        className="w-full sm:w-auto"
        onClick={() => {
          navigator.clipboard.writeText(fullUrl);
          toast({
            title: '복사 완료',
            description: '클립보드에 복사되었습니다.',
          });
        }}
      >
        COPY
      </Button>
    </div>
  );
};

export default UrlForm;
