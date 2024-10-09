// See https://documentation.bloomreach.com/discovery/docs/pixel-reference for pixel params reference

import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { usePathname } from 'next/navigation';
import { account_id, catalog_views, currency, debugPixel, domain_key } from '../config';

function useAnalytics() {
  const [events, setEvents] = useLocalStorage('BrPixelDemoAnalytics', []);
  const [userId, setUserId] = useLocalStorage('BrPixelDemoUserId', '');
  const [eventsCount, setEventsCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setEventsCount(events.length);
  }, [events]);

  /**
   * Adds default params that are relevant to all pixel events
   */
  const constructPayload = useCallback((data) => {
    return {
      ...{
        debug: debugPixel, // set to false in production
        test_data: debugPixel, // set to false in production
        acct_id: account_id,
        domain_key,
        user_id: userId,
        explicit_referrer: window.__BR_PRIOR_REFERRER__ ? window.__BR_PRIOR_REFERRER__ : document.referrer,
      },
      ...data,
    };
  }, []);

  const trackEvent = useCallback((data) => {
    let payload;

    switch (data.event) {
      case 'view_product':
        payload = {
          ptype: 'product',
          prod_id: data.pid,
          prod_name: data.title,
          sku: data.sku,
        };
        // for initial load, when the tracker script has not loaded, this will ensure that the view event
        // fires after the tracker script loads
        window.br_data = constructPayload(payload);
        window.BrTrk?.getTracker().updateBrData(constructPayload(payload));
        window.BrTrk?.getTracker().logPageView();
        window.__BR_PRIOR_REFERRER__ = window.location.href;
        break;
      case 'view_category':
        payload = {
          ptype: 'category',
          cat_id: data.cat_id,
          cat: data.cat_crumb,
        };
        // for initial load, when the tracker script has not loaded, this will ensure that the view event
        // fires after the tracker script loads
        window.br_data = constructPayload(payload);
        window.BrTrk?.getTracker().updateBrData(constructPayload(payload));
        window.BrTrk?.getTracker().logPageView();
        window.__BR_PRIOR_REFERRER__ = window.location.href;
        break;
      case 'view_search':
        payload = {
          ptype: 'search',
          search_term: data.query,
        };
        // for initial load, when the tracker script has not loaded, this will ensure that the view event
        // fires after the tracker script loads
        window.br_data = constructPayload(payload);
        window.BrTrk?.getTracker().updateBrData(constructPayload(payload));
        window.BrTrk?.getTracker().logPageView();
        window.__BR_PRIOR_REFERRER__ = window.location.href;
        break;
      case 'view_conversion':
        payload = {
          ptype: 'conversion',
          is_conversion: 1,
          basket_value: data.cartTotal,
          order_id: data.orderId,
          currency,
          basket: {
            items: data.cart.map((item) => {
              return {
                prod_id: item.id,
                sku: item.sku,
                name: item.title,
                quantity: item.count,
                price: item.price,
              };
            }),
          },
        };

        window.BrTrk?.getTracker().updateBrData(constructPayload(payload));
        window.BrTrk?.getTracker().logPageView();
        break;
      case 'event_addToCart':
        payload = {
          prod_id: data.pid,
          sku: data.sku,
        };

        window.BrTrk?.getTracker().logEvent(
          'cart',
          'click-add',
          constructPayload(payload),
        );
        break;
      case 'event_search':
        payload = {
          q: data.query,
          catalogs: [{ name: catalog_views }],
        };

        window.BrTrk?.getTracker().logEvent(
          'suggest',
          'submit',
          constructPayload(payload),
          {},
          true,
        );
        break;
      case 'event_suggest':
        payload = {
          aq: data.userQuery,
          q: data.query,
          catalogs: [{ name: catalog_views }],
        };

        window.BrTrk?.getTracker().logEvent(
          'suggest',
          'click',
          constructPayload(payload),
          {},
          true,
        );
        break;
      case 'event_widgetView':
        payload = {
          wid: data.widgetId,
          wty: data.widgetType,
          wq: data.widgetQuery, // Applicable for query widgets like search, category, past_purchases widgets
          wrid: data.widgetRequestId,
        };

        window.BrTrk?.getTracker().logEvent('widget', 'widget-view', constructPayload(payload));
        break;
      case 'event_widgetClick':
        payload = {
          wid: data.widgetId,
          wty: data.widgetType,
          wq: data.widgetQuery, // Applicable for query widgets like search, category, past_purchases widgets
          wrid: data.widgetRequestId,
          item_id: data.itemId,
        };

        window.BrTrk?.getTracker().logEvent('widget', 'widget-click', constructPayload(payload), true);
        break;
      default:
        payload = {};
        console.log('[useAnalytics] unknown event', data);
        break;
    }

    setEvents(_.take([...[{ ...payload, ...{ event: data.event } }], ...events], 26));
  }, [constructPayload, events, setEvents]);

  function clearEvents() {
    setEvents([]);
  }

  return { events, eventsCount, trackEvent, clearEvents, setUserId, userId };
}
export default useAnalytics;
