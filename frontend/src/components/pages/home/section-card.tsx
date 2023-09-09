import { AspectRatio } from '@/components/ui';
import Image from 'next/image';

export type TSectionCard = {
   id: string;
   name: string;
   description: string;
   image: string;
   path: string;
};

type Props = {
   item: TSectionCard;
};

export const SectionCard = ({ item }: Props) => {
   return (
      <div
         className="border-border border-2 flex items-center gap-4 p-4 bg-background"
         title={item.description}
      >
         <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
            <AspectRatio ratio={1 / 1}>
               <Image src={item.image} alt={item.name} fill />
            </AspectRatio>
         </div>
         <div>
            <h3 className="text-lg font-medium">{item.name}</h3>
            <p className="line-clamp-1">{item.description}</p>
         </div>
      </div>
   );
};

export default SectionCard;
