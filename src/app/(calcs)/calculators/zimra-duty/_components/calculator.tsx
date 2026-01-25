'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car, Package } from 'lucide-react';
import VehicleCalculator from './vehicle';
import GoodsCalculator from './goods';

export default function DutyCalculator() {
  const [activeTab, setActiveTab] = useState('vehicle');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-6 h-auto w-full flex-col gap-3 rounded-sm border border-zinc-200 bg-white p-1.5 sm:flex-row sm:gap-2">
        <TabsTrigger
          value="vehicle"
          className="w-full min-w-[140px] flex-1 rounded-sm bg-teal-50 py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white"
        >
          <Car className="mr-2 size-5" strokeWidth={1.5} />
          <h2>Duty on Vehicle</h2>
        </TabsTrigger>
        <TabsTrigger
          value="goods"
          className="w-full min-w-[140px] flex-1 rounded-sm bg-teal-50 py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white"
        >
          <Package className="mr-2 size-5" strokeWidth={1.5} />
          <h2>Duty on Goods</h2>
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="vehicle"
        className="rounded-md border border-zinc-200"
      >
        <VehicleCalculator />
      </TabsContent>
      <TabsContent value="goods" className="rounded-md border border-zinc-200">
        <GoodsCalculator />
      </TabsContent>
    </Tabs>
  );
}
