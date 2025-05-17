import type { TableData } from './Table';
import {
  TableCaption,
  TableTbody,
  TableTd,
  TableTfoot,
  TableTh,
  TableThead,
  TableTr,
} from './Table.components';

export interface TableDataRendererProps {
  data: TableData;
}

export function TableDataRenderer({ data }: TableDataRendererProps) {
  return (
    <>
      {data.caption && <TableCaption>{data.caption}</TableCaption>}

      {data.head && (
        <TableThead>
          <TableTr>
            {data.head.map((item, index) => (
              <TableTh>{item}</TableTh>
            ))}
          </TableTr>
        </TableThead>
      )}

      {data.body && (
        <TableTbody>
          {data.body.map((row, rowIndex) => (
            <TableTr>
              {row.map((item, index) => (
                <TableTd>{item}</TableTd>
              ))}
            </TableTr>
          ))}
        </TableTbody>
      )}

      {data.foot && (
        <TableTfoot>
          <TableTr>
            {data.foot.map((item, index) => (
              <TableTh>{item}</TableTh>
            ))}
          </TableTr>
        </TableTfoot>
      )}
    </>
  );
}

TableDataRenderer.displayName = '@mantine/core/TableDataRenderer';
