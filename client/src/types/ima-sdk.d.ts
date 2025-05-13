// Type definitions for Google IMA SDK
// This is a simplified version only including what we use

interface GoogleIma {
  ima: {
    AdDisplayContainer: new (container: HTMLElement) => {
      initialize: () => void;
    };
    AdsLoader: new (container: any) => {
      requestAds: (request: any) => void;
      addEventListener: (type: string, callback: (event: any) => void) => void;
    };
    AdsRequest: new () => {
      adTagUrl: string;
      linearAdSlotWidth: number;
      linearAdSlotHeight: number;
      nonLinearAdSlotWidth: number;
      nonLinearAdSlotHeight: number;
    };
    AdsManagerLoadedEvent: {
      Type: {
        ADS_MANAGER_LOADED: string;
      };
    };
    AdEvent: {
      Type: {
        COMPLETE: string;
        SKIPPED: string;
        ERROR: string;
      };
    };
    AdErrorEvent: {
      Type: {
        AD_ERROR: string;
      };
    };
    ViewMode: {
      NORMAL: string;
    };
  };
}

// Extend Window interface to include Google IMA
declare interface Window {
  google?: GoogleIma;
}