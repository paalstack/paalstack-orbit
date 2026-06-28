'use client';

import { LuEye, LuTrash2, LuChevronUp, LuChevronDown } from '@paalstack/react-icons/lu';
import {
  Box,
  HStack,
  VStack,
  Button,
  Select,
  Card,
  TypographyMuted,
  TypographySmall,
  TypographyP,
} from '@paalstack/react-ui';
import { format } from 'date-fns';
import Link from 'next/link';
import { useState } from 'react';

import { useDeleteLead } from '@/features/orbit/leads/hooks/useLeads';

import { LeadStatusBadge } from './LeadStatusBadge';

import type { LeadStatus } from '@/types/orbit';

type SortField = 'created_at' | 'value';

const SortIcon = ({
  field,
  sortField,
  sortAsc,
}: {
  field: SortField;
  sortField: SortField;
  sortAsc: boolean;
}) => {
  if (sortField !== field) return null;
  return sortAsc ? (
    <LuChevronUp className="ml-1 inline size-3" />
  ) : (
    <LuChevronDown className="ml-1 inline size-3" />
  );
};

type LeadRow = {
  id: string;
  name: string;
  company: string | null;
  status: LeadStatus;
  value: number | null;
  created_at: string;
  assignee?: { id: string; full_name: string | null; email: string | null } | null;
};

type LeadTableClientProps = {
  initialData: LeadRow[];
};

const STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Qualified', value: 'qualified' },
  { label: 'Proposal', value: 'proposal' },
  { label: 'Won', value: 'won' },
  { label: 'Lost', value: 'lost' },
];

const SORT_OPTIONS = [
  { label: 'Newest first', value: 'created_at' },
  { label: 'By value', value: 'value' },
];

export const LeadTableClient = ({ initialData }: LeadTableClientProps) => {
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortAsc, setSortAsc] = useState(false);
  const { mutate: deleteLead, isPending: isDeleting } = useDeleteLead();

  const filtered = initialData
    .filter((l) => !statusFilter || l.status === statusFilter)
    .sort((a, b) => {
      if (sortField === 'value') {
        const diff = (a.value ?? 0) - (b.value ?? 0);
        return sortAsc ? diff : -diff;
      }
      const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sortAsc ? diff : -diff;
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc((v) => !v);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <VStack className="gap-4">
      <HStack className="gap-3">
        <Select
          options={STATUS_OPTIONS}
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v ?? '')}
          placeholder="Filter by status"
          className="w-44"
        />
        <Select
          options={SORT_OPTIONS}
          value={sortField}
          onValueChange={(v) => {
            setSortField(v as SortField);
            setSortAsc(false);
          }}
          placeholder="Sort by"
          className="w-40"
        />
      </HStack>

      <Card contentClassName="p-0" className="overflow-hidden">
        <Box className="overflow-x-auto">
          <Box as="table" className="w-full text-sm">
            <Box as="thead" className="border-border border-b">
              <Box as="tr">
                <Box as="th" className="text-muted-foreground px-4 py-3 text-left font-medium">
                  Name
                </Box>
                <Box as="th" className="text-muted-foreground px-4 py-3 text-left font-medium">
                  Company
                </Box>
                <Box as="th" className="text-muted-foreground px-4 py-3 text-left font-medium">
                  Status
                </Box>
                <Box
                  as="th"
                  className="text-muted-foreground hover:text-foreground cursor-pointer px-4 py-3 text-left font-medium"
                  onClick={() => handleSort('value')}
                >
                  Value
                  <SortIcon field="value" sortField={sortField} sortAsc={sortAsc} />
                </Box>
                <Box as="th" className="text-muted-foreground px-4 py-3 text-left font-medium">
                  Assigned To
                </Box>
                <Box
                  as="th"
                  className="text-muted-foreground hover:text-foreground cursor-pointer px-4 py-3 text-left font-medium"
                  onClick={() => handleSort('created_at')}
                >
                  Created
                  <SortIcon field="created_at" sortField={sortField} sortAsc={sortAsc} />
                </Box>
                <Box as="th" className="text-muted-foreground px-4 py-3 text-left font-medium">
                  Actions
                </Box>
              </Box>
            </Box>
            <Box as="tbody">
              {filtered.length === 0 ? (
                <Box as="tr">
                  <Box as="td" className="px-4 py-8 text-center" style={{ gridColumn: 'span 7' }}>
                    <TypographyMuted>No leads found</TypographyMuted>
                  </Box>
                </Box>
              ) : (
                filtered.map((lead) => (
                  <Box
                    as="tr"
                    key={lead.id}
                    className="border-border hover:bg-muted/40 border-b last:border-0"
                  >
                    <Box as="td" className="px-4 py-3">
                      <TypographyP className="text-foreground font-medium">{lead.name}</TypographyP>
                    </Box>
                    <Box as="td" className="px-4 py-3">
                      <TypographyMuted>{lead.company ?? '—'}</TypographyMuted>
                    </Box>
                    <Box as="td" className="px-4 py-3">
                      <LeadStatusBadge status={lead.status} />
                    </Box>
                    <Box as="td" className="px-4 py-3">
                      <TypographySmall className="text-muted-foreground">
                        {lead.value != null ? `$${lead.value.toLocaleString()}` : '—'}
                      </TypographySmall>
                    </Box>
                    <Box as="td" className="px-4 py-3">
                      <TypographySmall className="text-muted-foreground">
                        {lead.assignee?.full_name ?? lead.assignee?.email ?? '—'}
                      </TypographySmall>
                    </Box>
                    <Box as="td" className="px-4 py-3">
                      <TypographySmall className="text-muted-foreground">
                        {format(new Date(lead.created_at), 'MMM d, yyyy')}
                      </TypographySmall>
                    </Box>
                    <Box as="td" className="px-4 py-3">
                      <HStack className="gap-2">
                        <Button asChild variant="ghost" size="sm" className="cursor-pointer">
                          <Link href={`/leads/${lead.id}`}>
                            <LuEye className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/80 cursor-pointer"
                          disabled={isDeleting}
                          onClick={() => {
                            deleteLead(lead.id);
                          }}
                        >
                          <LuTrash2 className="size-4" />
                        </Button>
                      </HStack>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Box>
      </Card>
    </VStack>
  );
};
