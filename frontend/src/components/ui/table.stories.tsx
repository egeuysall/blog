import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './table';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Table>;

export const ComplexTable: Story = {
  render: () => (
    <Table>
      <TableCaption>Monthly Sales Summary for 2025</TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead>Month</TableHead>
          <TableHead>Region</TableHead>
          <TableHead className="text-right">Sales ($)</TableHead>
          <TableHead className="text-right">Expenses ($)</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow>
          <TableCell>January</TableCell>
          <TableCell>North America</TableCell>
          <TableCell className="text-right">12,400</TableCell>
          <TableCell className="text-right">5,200</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>February</TableCell>
          <TableCell>Europe</TableCell>
          <TableCell className="text-right">9,800</TableCell>
          <TableCell className="text-right">4,900</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>March</TableCell>
          <TableCell>Asia</TableCell>
          <TableCell className="text-right">14,100</TableCell>
          <TableCell className="text-right">6,000</TableCell>
        </TableRow>
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right font-bold">36,300</TableCell>
          <TableCell className="text-right font-bold">16,100</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};
