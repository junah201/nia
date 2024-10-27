import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';

import { getAllURL } from '@/api/url';
import { Table } from '@/components/Table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { QUERY } from '@/constants/query';
import { fromNow, utcToKST } from '@/lib/Day';
import { URL } from '@/types/url';

const columns: ColumnDef<URL, any>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'SURL',
    accessorKey: 'PK',
    header: '단축 URL',
    cell: (info) => {
      const surl = info.getValue().split('#')[1];

      return <div className="">{surl}</div>;
    },
  },
  {
    id: 'URL',
    accessorKey: 'SK',
    header: '원본 URL',
    cell: (info) => {
      const url = info.getValue().split('#')[1];
      return (
        <a className="text-primary hover:underline" href={url}>
          {url}
        </a>
      );
    },
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: '생성시점',
    cell: (info) => {
      const created_at = utcToKST(info.getValue()).format(
        'YYYY-MM-DD HH:mm:ss'
      );
      return (
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>{fromNow(created_at)}</div>
            </TooltipTrigger>
            <TooltipContent>
              <div>{created_at}</div>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
  {
    id: 'stats',
    accessorKey: 'PK',
    header: '통계',
    cell: (info) => {
      const url = info.getValue().split('#')[1];
      return (
        <Button variant="outline" size="sm" color="primary" asChild>
          <a href={`/url/${url}`}>통계</a>
        </Button>
      );
    },
  },
];

const Urls = () => {
  return (
    <Table
      size={10}
      queryKey={QUERY.KEY.ALL_MY_URLS}
      queryFn={getAllURL}
      columns={columns}
      showLoading={true}
    />
  );
};

export default Urls;
