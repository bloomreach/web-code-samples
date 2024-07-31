import _ from 'lodash';
import {useCallback, useEffect, useState} from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { usePathname } from 'next/navigation';
import { account_id, catalog_views, domain_key } from '../config';

function useAnalytics() {
  const [events, setEvents] = useLocalStorage('BrPixelDemoAnalytics', []);
  const [userId, setUserId] = useLocalStorage('BrPixelDemoUserId', '');
  const [eventsCount, setEventsCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setEventsCount(events.length);
  }, [events]);

  const constructPayload = (data) => {
    return {
      ...{
        debug: true, // set to false in production
        test_data: true, // set to false in production
        acct_id: account_id,
        domain_key,
        user_id: userId,
        orig_ref_url: `${window.location.origin}${pathname}`,
      },
      ...data,
    };
  };

  const trackEvent = (data) => {
    let payload;

    switch (data.event) {
      case 'view_product':
        payload = {
          ptype: 'product',
          prod_id: data.pid,
          prod_name: data.title,
          sku: data.sku,
        };
        BrTrk?.getTracker().updateBrData(constructPayload(payload));
        BrTrk?.getTracker().logPageView();
        break;
      case 'view_category':
        payload = {
          ptype: 'category',
          cat_id: data.cat_id,
          cat: data.cat_crumb,
        };
        BrTrk?.getTracker().updateBrData(constructPayload(payload));
        BrTrk?.getTracker().logPageView();

        break;
      case 'view_search':
        payload = {
          ptype: 'search',
          search_term: data.query,
        };

        BrTrk?.getTracker().updateBrData(constructPayload(payload));
        BrTrk?.getTracker().logPageView();
        break;
      case 'view_conversion':
        payload = {
          ptype: 'conversion',
          is_conversion: 1,
          basket_value: data.cartTotal,
          order_id: data.orderId,
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

        BrTrk?.getTracker().updateBrData(constructPayload(payload));
        BrTrk?.getTracker().logPageView();
        break;
      case 'event_addToCart':
        payload = {
          prod_id: data.pid,
          sku: data.sku,
        };

        BrTrk?.getTracker().logEvent(
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

        BrTrk?.getTracker().logEvent(
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

        BrTrk?.getTracker().logEvent(
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
          wrid: data.widgetRequestId,
        };

        BrTrk?.getTracker().logEvent('widget', 'widget-view', constructPayload(payload), true);
        break;
      case 'event_widgetClick':
        payload = {
          wid: data.widgetId,
          wty: data.widgetType,
          wrid: data.widgetRequestId,
          item_id: data.itemId,
        };

        BrTrk?.getTracker().logEvent('widget', 'widget-click', constructPayload(payload), true);
        break;
      default:
        payload = {};
        console.log('[useAnalytics] unknown event', data);
        break;
    }

    setEvents(_.take([...[{ ...payload, ...{ event: data.event } }], ...events], 25));
  };

  function clearEvents() {
    setEvents([]);
  }

  return { events, eventsCount, trackEvent, clearEvents, setUserId, userId };
}
export default useAnalytics;
